/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable-next-line import/no-unresolved */
import path from 'node:path';

import { NestExpressApplication } from '@nestjs/platform-express';
import { createRequestHandler } from '@remix-run/express';
import { installGlobals } from '@remix-run/node';

import { static as expressStatic } from 'express';
import sourceMapSupport from 'source-map-support';

sourceMapSupport.install();
installGlobals();

// sensible defaults for most Nest apps
const DEFAULT_NEST_PATHS = ['api', 'graphql'];

// the path to the Remix server build
const BUILD_PATH = path.resolve(process.cwd(), 'build', 'index.js');

export async function mountRemixHandler(
    nestApp: NestExpressApplication,
    NEST_PATHS = DEFAULT_NEST_PATHS
) {
    const viteDevServer =
        process.env.NODE_ENV === 'production'
            ? undefined
            : await import('vite').then(vite =>
                  vite.createServer({
                      server: { middlewareMode: true }
                  })
              );

    const remixHandler = createRequestHandler({
        build: viteDevServer
            ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
            : // @ts-ignore
              await import(BUILD_PATH),
        getLoadContext() {
            return { app: nestApp };
        }
    });

    const expressApp = nestApp.getHttpAdapter().getInstance();

    // handle asset requests
    if (viteDevServer) {
        expressApp.use(viteDevServer.middlewares);
    } else {
        // Vite fingerprints its assets so we can cache forever.
        expressApp.use(
            '/assets',
            expressStatic('build/client/assets', {
                immutable: true,
                maxAge: '1y'
            })
        );
    }

    // Everything else (like favicon.ico) is cached for an hour. You may want to be
    // more aggressive with this caching.
    expressApp.use(expressStatic('build/client', { maxAge: '1h' }));

    // build a regex to match all routes that are not handled by Nest
    const remixPath = new RegExp(`/^\/(?!(${NEST_PATHS.join('|')}))\/`);

    // mount the actual Remix request handler
    // app.all('*', remixHandler);
    expressApp.all(['/', remixPath], remixHandler);
}
