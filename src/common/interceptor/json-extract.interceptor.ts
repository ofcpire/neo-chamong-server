import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JsonExtractInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, call: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    if (!req.files) return call.handle();
    const jsonFile = req.files.find(
      (file: Express.Multer.File) => file.mimetype === 'application/json',
    );
    req.body = JSON.parse(jsonFile.buffer);
    return call.handle();
  }
}
