import { CurrentUser } from 'src/common/types';

declare module 'fastify' {
  interface FastifyRequest {
    user?: CurrentUser;
  }
}