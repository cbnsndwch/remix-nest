import type { LoaderFunction as RRLoaderFunction } from '@remix-run/router';

import type { Params } from '@remix-run/react';
import type { NestApplication } from '@nestjs/core';

export interface LoaderFunctionArgs {
    request: Request;
    params: Params;
    context: {
        app: NestApplication;
        [key: string]: any;
    };
}

export type LoaderFunction = (
    args: LoaderFunctionArgs
) => ReturnType<RRLoaderFunction>;
