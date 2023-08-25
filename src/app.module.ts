import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@User/user.module';
import { PrismaModule } from '@Prisma/prisma.module';
import { HomeModule } from '@Home/home.module';
import { UserInterceptor } from '@User/interceptors/user.interceptor';
import { AuthGuard } from '@Guard/auth.guard';

@Module({
  imports: [UserModule, PrismaModule, HomeModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
