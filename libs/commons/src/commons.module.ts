import { Module } from '@nestjs/common';
import { CommonsService } from './commons.service';
import { PlaywrightModule } from './playwright/playwright.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [PlaywrightModule, RedisModule],
  providers: [CommonsService],
  exports: [CommonsService],
})
export class CommonsModule {}
