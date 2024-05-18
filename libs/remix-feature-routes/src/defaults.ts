import path from 'node:path';

export const DEFAULT_APP_DIR = path.resolve(process.cwd(), 'app');

export const routeDir = 'routes';

export const basePath = '/';

export const paramPrefixChar = '$';

export const routeRegex =
    /(([+][\/\\][^\/\\:?*]+)|[\/\\]((index|route|layout|page)|(_[^\/\\:?*]+)|([^\/\\:?*]+\.route)))\.(ts|tsx|md|mdx)$$/;
