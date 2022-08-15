import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';

const redisProvider = {
  provide: 'redis',
  useFactory(config: ConfigService) {
    return new IORedis({
      host: config.get('REDIS_HOST', 'localhost'),
      port: config.get('REDIS_PORT', 6379),
      db: config.get('REDIS_DB', 0),
    });
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: 'env.example' })],
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
