import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { NestExpressApplication } from '@nestjs/platform-express';
import { createRequestHandler } from '@remix-run/express';
import {
    broadcastDevReady,
    installGlobals,
    type ServerBuild
} from '@remix-run/node';

import { type RequestHandler, static as expressStatic } from 'express';
import sourceMapSupport from 'source-map-support';

sourceMapSupport.install();
installGlobals();

const REMIX_ROOT = process.env.REMIX_BUILD_ROOT!;
const BUILD_PATH = path.resolve(REMIX_ROOT, 'build', 'index.js');
const VERSION_PATH = path.resolve(REMIX_ROOT, 'build', 'version.txt');
const ASSETS_PATH = path.resolve(REMIX_ROOT, 'public', 'build');

export async function mountRemixHandler(nestApp: NestExpressApplication) {
    async function reimportServer(): Promise<ServerBuild> {
        // cjs: manually remove the server build from the require cache
        Object.keys(require.cache).forEach(key => {
            if (key.startsWith(BUILD_PATH)) {
                delete require.cache[key];
            }
        });

        const stat = fs.statSync(BUILD_PATH);

        // convert build path to URL for Windows compatibility with dynamic `import`
        const BUILD_URL = url.pathToFileURL(BUILD_PATH).href;

        // use a timestamp query parameter to bust the import cache
        return import(BUILD_URL + '?t=' + stat.mtimeMs);
    }

    async function createDevRequestHandler(
        initialBuild: ServerBuild,
        app: NestExpressApplication
    ): Promise<RequestHandler> {
        let build = initialBuild;

        async function handleServerUpdate() {
            // 1. re-import the server build
            build = await reimportServer();

            // 2. tell Remix that this app server is now up-to-date and ready
            broadcastDevReady(build);
        }

        const chokidar = await import('chokidar');
        chokidar
            .watch(VERSION_PATH, { ignoreInitial: true })
            .on('add', handleServerUpdate)
            .on('change', handleServerUpdate);

        // wrap request handler to make sure its recreated with the latest build for every request
        return async (req, res, next) => {
            try {
                return createRequestHandler({
                    build,
                    mode: 'development',
                    getLoadContext() {
                        return { app };
                    }
                })(req, res, next);
            } catch (error) {
                next(error);
            }
        };
    }

    const initialBuild = await reimportServer();
    const remixHandler =
        process.env.NODE_ENV === 'development'
            ? await createDevRequestHandler(initialBuild, nestApp)
            : createRequestHandler({
                  build: initialBuild,
                  mode: initialBuild.mode,
                  getLoadContext() {
                      return { app: nestApp };
                  }
              });

    const app = nestApp.getHttpAdapter().getInstance();

    // static assets. Remix fingerprints its assets so we can cache forever.
    app.use(
        '/build',
        expressStatic(ASSETS_PATH, { immutable: true, maxAge: '1y' })
    );

    // the actual Remix request handler
    app.all('*', remixHandler);

    return async function onListen() {
        if (process.env.NODE_ENV === 'development') {
            await broadcastDevReady(initialBuild);
        }
    };
}
