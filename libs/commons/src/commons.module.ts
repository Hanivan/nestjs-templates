import { Module } from '@nestjs/common';
import { CommonsService } from './commons.service';
import { RedisModule } from './redis/redis.module';

@Module({
  providers: [CommonsService],
  exports: [CommonsService],
  imports: [RedisModule],
})
export class CommonsModule {}
