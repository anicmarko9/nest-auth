import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const token: string = request?.headers?.authorization?.split('Bearer ')[1];
    const user: string | jwt.JwtPayload = jwt.decode(token);
    request.user = user;
    return handler.handle();
  }
}
