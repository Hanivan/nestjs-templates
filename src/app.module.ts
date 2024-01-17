import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AnimalsModule } from './animals/animals.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // default storageis redis
    BullModule.forRoot({ defaultJobOptions: { removeOnComplete: true, } }),
    EventEmitterModule.forRoot(),
    AnimalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
