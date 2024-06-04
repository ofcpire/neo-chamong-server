import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class WrapContentInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, call: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    if (req.method === 'GET') {
      return call.handle().pipe(map((data) => ({ content: data })));
    }

    return call.handle();
  }
}
