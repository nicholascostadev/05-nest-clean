import { createParamDecorator } from '@nestjs/common';
import { UserPayload } from './jwt.strategy';
import { Request } from 'express';

export const CurrentUser = createParamDecorator((_, context) => {
  const request = context.switchToHttp().getRequest<Request>();

  return request.user as UserPayload;
});
