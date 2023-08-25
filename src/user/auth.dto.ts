import { UserType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @Matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
    message: 'Invalid phone number.',
  })
  phone: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(5)
  password: string;
  @IsOptional()
  productKey?: string;
}

export class SignInDto {
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class GenerateProductKeyDto {
  @IsEmail()
  email: string;
  @IsEnum(UserType)
  user_type: UserType;
}
