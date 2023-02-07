import { DBKey } from '@libs/commons/typeorm-config/constant';
import { TypeOrmConfig } from '@libs/commons/typeorm-config/typeorm-config';
import { TypeormConfigModule } from '@libs/commons/typeorm-config/typeorm-config.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Example } from './entity/example.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [TypeormConfigModule.register()], // this will use default connection
      useExisting: TypeOrmConfig,
    }),
    TypeOrmModule.forFeature([Example]),
    // TypeOrmModule.forRootAsync({
    //   imports: [TypeormConfigModule.register(DBKey.DB_SECONDARY)], // this will use secondary connection
    //   useExisting: TypeOrmConfig,
    // }),
    // TypeOrmModule.forFeature([YourEntity], DBKey.DB_SECONDARY),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
