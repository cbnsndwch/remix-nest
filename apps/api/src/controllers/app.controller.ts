import { Controller, Get, Inject } from '@nestjs/common';

import { AppService } from '../services';

@Controller()
export class AppController {
    constructor(
        @Inject(AppService.name)
        private readonly appService: AppService
    ) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
