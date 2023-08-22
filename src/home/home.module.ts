import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { HomeController } from '@home/home.controller';
import { HomeService } from '@home/home.service';
import { PrismaModule } from '@prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [PrismaModule],
  controllers: [HomeController],
  providers: [
    HomeService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class HomeModule {}
