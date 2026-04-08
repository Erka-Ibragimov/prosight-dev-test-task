import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublicRoute(context)) return true;

    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const token = this.extractTokenFromHeader(request);
    if (!token) this.throwUnauthorizedException();

    try {
      const payload = await this.verifyToken(token);

      request['user'] = payload;
    } catch {
      this.throwUnauthorizedException();
    }

    return true;
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async verifyToken(token: string): Promise<CurrentUser> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('jwt.secret'),
    });

    return payload as CurrentUser;
  }

  private throwUnauthorizedException(): never {
    throw new UnauthorizedException();
  }
}
