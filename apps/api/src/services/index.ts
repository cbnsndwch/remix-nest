import { AppService } from './app.service';

export * from './app.service';

export const services = [
    {
        provide: AppService.name,
        useClass: AppService
    }
];
