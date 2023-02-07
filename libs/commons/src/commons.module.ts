import { Module } from '@nestjs/common';
import { CommonsService } from './commons.service';
import { TypeormConfigModule } from './typeorm-config/typeorm-config.module';

@Module({
  providers: [CommonsService],
  exports: [CommonsService],
  imports: [TypeormConfigModule],
})
export class CommonsModule {}
