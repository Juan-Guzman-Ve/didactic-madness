import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: T): Response<T> => {
        // If data already has the correct structure, return as-is
        if (data && typeof data === 'object' && 'data' in data) {
          return data as Response<T>;
        }

        // Wrap data in standard response envelope
        return {
          data,
        };
      }),
    );
  }
}
