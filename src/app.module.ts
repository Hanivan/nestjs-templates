import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './guards';
import { PrismaModule } from './prisma/prisma.module';
import { CaslModule } from './casl/casl.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [AuthModule, PrismaModule, CaslModule, MediaModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_GUARD, useClass: AccessTokenGuard },
  ],
})
export class AppModule {}
