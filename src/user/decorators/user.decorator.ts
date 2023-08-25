import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface UserInfo {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

export const User = createParamDecorator(
  (context: ExecutionContext): ParameterDecorator => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
