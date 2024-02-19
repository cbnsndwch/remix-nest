import { defineConfig } from 'vite';

import { unstable_vitePlugin as viteRemix } from '@remix-run/dev';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        viteRemix({
            ignoredRouteFiles: ['**/.*', '**/*.test.{ts,tsx}'],
            serverModuleFormat: 'cjs'
        }),
        viteTsconfigPaths()
    ]
});
