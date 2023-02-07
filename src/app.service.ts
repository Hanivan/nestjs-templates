import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Example } from './entity/example.entity';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectRepository(Example) private readonly conExample: Repository<Example>,
    // @InjectRepository(YourEntity) private readonly conYourEntity:Repository<YourEntity>,
    private readonly config: ConfigService,
  ) {}

  async getExamples() {
    return this.conExample.find();
  }
}
