import {
  CallHandler,
  ExecutionContext, HttpStatus,
  Injectable,
  NestInterceptor
} from "@nestjs/common"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { Result } from "../model/result.model"

@Injectable()
export class AdviceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => new Result(HttpStatus.OK, undefined, data)))
  }
}
