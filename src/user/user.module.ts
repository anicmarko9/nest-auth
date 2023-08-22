import { Module } from '@nestjs/common';
import { AuthController } from '@user/auth/auth.controller';
import { AuthService } from '@user/auth/auth.service';
import { PrismaModule } from '@prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class UserModule {}
