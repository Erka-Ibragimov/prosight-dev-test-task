import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const MAX = BigInt(Number.MAX_SAFE_INTEGER);
const MIN = BigInt(Number.MIN_SAFE_INTEGER);

function serializeBigInts(value: unknown): unknown {
  if (typeof value === 'bigint') {
    if (value >= MIN && value <= MAX) {
      return Number(value);
    }
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.map((item) => serializeBigInts(item));
  }
  if (value !== null && typeof value === 'object') {
    if (value instanceof Date) {
      return value;
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = serializeBigInts(v);
    }
    return out;
  }
  return value;
}

@Injectable()
export class BigIntJsonInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(map((data) => serializeBigInts(data)));
  }
}
