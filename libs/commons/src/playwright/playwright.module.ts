import { Module } from '@nestjs/common';
import { RedisModule } from '@libs/commons/redis/redis.module';
import { PlaywrightService } from './playwright.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [RedisModule, ConfigModule.forRoot({ envFilePath: 'env.example' })],
  providers: [PlaywrightService],
  exports: [PlaywrightService],
})
export class PlaywrightModule {}
