import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '../users/entities/user.entity';

export type UserPayload = Pick<User, 'id' | 'email' | 'name'>;

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
