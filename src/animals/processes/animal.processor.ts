import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ANIMAL } from '../types/animal.types';

@Processor('animal')
export class AnimalProcessor {
  private readonly logger = new Logger(AnimalProcessor.name);

  @Process(ANIMAL.TRANSCODE.toString())
  handleAnimal(job: Job) {
    job.moveToCompleted();
    job.remove();
    this.logger.debug('Received Job...');
    console.time('queue');
    this.logger.debug(job.data);
    job.moveToCompleted();
    console.timeEnd('queue');

    this.logger.debug('Job Processed!');
  }
}
