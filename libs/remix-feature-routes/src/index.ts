import path from 'node:path';

import type {
    DefineRouteFn,
    DefineRoutesFn,
    FeatureRoutesOptions,
    RemixRoutesFactory,
    RouteInfo
} from './contracts';
import { DEFAULT_APP_DIR } from './defaults';
import { walk } from './utils';

export default function featureRoutes(
    options: FeatureRoutesOptions
): RemixRoutesFactory {
    const featuresDir = path.join(
        options.appDir ?? DEFAULT_APP_DIR,
        'features'
    );

    return async function (defineRoutes: DefineRoutesFn) {
        // const options = {
        //     ...defaultOptions,
        //     ...options,
        //     routeDir,
        //     defineRoutes
        // };

        const routeMap: Map<string, RouteInfo> = new Map();
        const nameMap: Map<string, RouteInfo> = new Map();

        for await (const dir of walk(featuresDir)) {
            const [feature, ...pathSegments] = dir.name.split(path.sep);
            const filePath = path.join(...pathSegments);

            console.log(feature + ': ' + filePath);
        }

        // Then, recurse through all routes using the public defineRoutes() API
        function defineNestedRoutes(
            defineRoute: DefineRouteFn,
            parentId?: string
        ): void {
            // TODO: implement
        }

        const routes = defineRoutes(defineNestedRoutes);

        // update `undefined` parentIds to `root`
        for (const route of Object.values(routes)) {
            if (route.parentId !== undefined) {
                continue;
            }

            route.parentId = 'root';
        }

        return routes;
    };
}
