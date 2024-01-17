import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { AnimalListener } from './processes/animal.listener';
import { AnimalProcessor } from './processes/animal.processor';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    BullModule.registerQueue({ name: 'animal' }),
  ],
  controllers: [AnimalsController],
  providers: [AnimalsService, AnimalProcessor, AnimalListener],
})
export class AnimalsModule {}
