import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

import { PrismaService } from '@Prisma/prisma.service';

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface SigninParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup({ email, password, name, phone }: SignupParams) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (userExists) throw new ConflictException();

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        phone,
      },
    });

    return this.generateJWT(user.name, user.id);
  }
  async signin({ email, password }: SigninParams) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new HttpException('Invalid credentials', 400);

    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) throw new HttpException('Invalid credentials', 400);

    return this.generateJWT(user.name, user.id);
  }

  private generateJWT(name: string, id: number): string {
    return jwt.sign(
      {
        name,
        id,
      },
      process.env.JSON_TOKEN_KEY,
      {
        expiresIn: '3 days',
      },
    );
  }

  async generateProductKey(email: string, user_type: UserType) {
    const string = `${email}-${user_type}-${process.env.PRODUCT_KEY_SECRET}`;
    return await bcrypt.hash(string, 10);
  }
}
