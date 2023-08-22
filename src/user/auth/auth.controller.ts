import {
  Controller,
  Post,
  Body,
  Param,
  ParseEnumPipe,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '@user/auth/auth.service';
import { GenerateProductKeyDto, SignInDto, SignUpDto } from '@user/auth.dto';
import { UserType } from '@prisma/client';
import { User, UserInfo } from '@user/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/:user_type')
  async signup(
    @Body() body: SignUpDto,
    @Param('user_type', new ParseEnumPipe(UserType)) user_type: UserType,
  ) {
    if (user_type !== 'BUYER') {
      if (!body.productKey) throw new UnauthorizedException();
      const validProductKey = `${body.email}-${user_type}-${process.env.PRODUCT_KEY_SECRET}`;
      const isValidProductKey = await bcrypt.compare(
        validProductKey,
        body.productKey,
      );
      if (!isValidProductKey) throw new UnauthorizedException();
    }
    return this.authService.signup(body);
  }

  @Post('signin')
  signin(@Body() body: SignInDto) {
    return this.authService.signin(body);
  }

  @Post('key')
  generateProductKey(@Body() { email, user_type }: GenerateProductKeyDto) {
    return this.authService.generateProductKey(email, user_type);
  }

  @Get('me')
  me(@User() user: UserInfo) {
    return user;
  }
}
