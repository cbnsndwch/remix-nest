import type { MetaFunction } from '@remix-run/node';
import { Params, useLoaderData } from '@remix-run/react';
import type { NestApplication } from '@nestjs/core';

import type { IAppService } from '@cbnsndwch/repo-contracts';

export const meta: MetaFunction = () => [{ title: 'Remix Notes' }];

type LoaderArgs = {
    request: Request;
    params: Params;
    context: {
        app: NestApplication;
        [key: string]: any;
    };
};

export async function loader({ context }: LoaderArgs) {
    const appService: IAppService = context.app.get('AppService');

    return {
        date: new Date().toISOString(),
        hello: await appService.getHello()
    };
}

export default function Index() {
    const { date, hello } = useLoaderData<Awaited<typeof loader>>();
    // const user = useOptionalUser();

    return (
        <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
            <div className="relative sm:pb-16 sm:pt-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
                        <div className="absolute inset-0">
                            <div className="absolute inset-0 bg-amber-500/80 mix-blend-multiply" />
                        </div>
                        <div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
                            <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                                <span className="block uppercase text-white drop-shadow-md">
                                    {hello}
                                </span>
                            </h1>
                            <p className="mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl">
                                <code>
                                    @remix-run/express + NestJS Custom Server!!!
                                </code>
                            </p>
                            <a href="https://remix.run">
                                <img
                                    src="https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg"
                                    alt="Remix"
                                    className="mx-auto mt-16 w-full max-w-[12rem] md:max-w-[16rem]"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
