import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser } from 'src/common/types';
import { FastifyRequest } from 'fastify';

export const User = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>();

  return request.user as CurrentUser;
});
