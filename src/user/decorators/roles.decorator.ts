import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserType } from '@prisma/client';

export const Roles = (...roles: UserType[]): CustomDecorator<string> =>
  SetMetadata('roles', roles);
