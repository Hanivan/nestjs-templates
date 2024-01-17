import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { AnimalCreatedEvent } from './processes/animal.listener';
import { ANIMAL, ANIMAL_EVENT } from './types/animal.types';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectQueue('animal') private readonly animalQueue: Queue,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  create(createAnimalDto: CreateAnimalDto) {
    return 'This action adds a new animal';
  }

  async sendQueue() {
    console.time('send queue1');
    await this.animalQueue.add(
      ANIMAL.TRANSCODE.toString(),
      ['cat', 'dog', 'bird'],
      { removeOnComplete: true, lifo: true },
    );
    console.timeEnd('send queue1');

    return 'queue sended!';
  }

  sendEvent() {
    console.time('send event');
    this.eventEmitter.emit(ANIMAL_EVENT, [
      'chicken',
      'cow',
      'sheep',
    ] as AnimalCreatedEvent);
    console.timeEnd('send event');

    return 'event sended!';
  }

  findAll() {
    return `This action returns all animals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} animal`;
  }

  update(id: number, updateAnimalDto: UpdateAnimalDto) {
    return `This action updates a #${id} animal`;
  }

  remove(id: number) {
    return `This action removes a #${id} animal`;
  }
}
