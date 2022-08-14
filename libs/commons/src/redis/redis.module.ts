import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';

const redisProvider = {
  provide: 'redis',
  useFactory(config: ConfigService) {
    return new IORedis({
      // add some config here
    });
  },
  inject: [ConfigService],
};

@Module({
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
