import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ANIMAL_EVENT } from '../types/animal.types';

export type AnimalCreatedEvent = string[];

@Injectable()
export class AnimalListener {
  private readonly logger = new Logger(AnimalListener.name);

  @OnEvent(ANIMAL_EVENT)
  handleAnimalEvent(event: AnimalCreatedEvent) {
    this.logger.debug('Received Event...');
    console.time('event');

    (async () => {
      await this.simulateHeavyProcess(event);
    })();

    console.timeEnd('event');
    this.logger.debug('Event Processed!');
  }

  private async simulateHeavyProcess(event: AnimalCreatedEvent) {
    console.log('wait');
    await new Promise((res) => setTimeout(res, 10 * 1000));
    console.log('ok');
    this.logger.debug(event);
  }
}
