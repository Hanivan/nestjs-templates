import { AxiosProxyModule } from '@libs/commons/axios-proxy/axios-proxy.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AxiosProxyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
