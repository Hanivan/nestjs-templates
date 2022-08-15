import { PlaywrightModule } from '@libs/commons/playwright/playwright.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'env.example' }),
    PlaywrightModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
