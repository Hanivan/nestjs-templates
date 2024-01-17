import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // constructor(@InjectQueue('animal') private readonly animalQueue: Queue) {}

  // async sendQueueAnimal(){
  //   return this.animalQueue.add('transcode',['cat','dog','bird'])
  // }

  // sendEventAnimal(){

  // }

  getHello(): string {
    return 'Hello World!';
  }
}
