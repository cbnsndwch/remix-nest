/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'lib',
        lib: {
            entry: './src/index.ts',
            name: 'remix-feature-routes',
            formats: ['es', 'cjs']
        }
    },
    test: {
        globals: true,
        environment: 'node'
    }
} as any);
