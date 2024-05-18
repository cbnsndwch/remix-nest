import path from 'path';

import { defineRoutes } from '@remix-run/dev/dist/config/routes';

import featureRoutes from '../index';

const appDir = path.resolve(process.cwd(), '..', '..', 'apps', 'server', 'app');
const routes = featureRoutes({ appDir });

describe('featureRoutes', () => {
    it('(TEMP) should print walked dirs', async () => {
        await routes(defineRoutes);

        expect(true).toBeTruthy();
    });
});
