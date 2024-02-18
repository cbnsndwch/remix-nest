import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { makeTable } from './utils';

const PORT = process.env.SERVER_PORT || 4003;

const logger = new Logger('Bootstrap');

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: true,
        logger
    });

    app.setGlobalPrefix('api');

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            forbidUnknownValues: false
        })
    );

    await app.listen(PORT);

    const banner = makeTable(
        {
            'Base URL': `http://127.0.0.1:${PORT}`,
            REST: `http://127.0.0.1:${PORT}/api`
        },
        `🚀 Server running 🚀`
    );
    banner.forEach(line => logger.log(line));
}

bootstrap();
