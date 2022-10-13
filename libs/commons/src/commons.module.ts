import { Module } from '@nestjs/common';
import { CommonsService } from './commons.service';
import { AxiosProxyModule } from './axios-proxy/axios-proxy.module';

@Module({
  providers: [CommonsService],
  exports: [CommonsService],
  imports: [AxiosProxyModule],
})
export class CommonsModule {}
