import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get('queue/animal')
  // handleQueueAnimal() {
  //   return this.appService.sendQueueAnimal();
  // }

  // @Get('event/animal')
  // handleEventAnimal() {
  //   return this.appService.sendEventAnimal();
  // }
}
