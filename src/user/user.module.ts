import { Module } from '@nestjs/common';

import { AuthController } from '@User/auth/auth.controller';
import { AuthService } from '@User/auth/auth.service';
import { PrismaModule } from '@Prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class UserModule {}
