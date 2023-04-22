import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export class UserInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split('Bearer ')[1];

    if (token) {
      const user = await jwt.verify(token, process.env.JSON_TOKEN_KEY);

      request.user = user;
    }
    return handler.handle();
  }
}
