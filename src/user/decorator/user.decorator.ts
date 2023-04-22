import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

export type UserInfo = {
  name: string;
  id: number;
};

export const User = createParamDecorator(
  (data, context: ExecutionContextHost) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
