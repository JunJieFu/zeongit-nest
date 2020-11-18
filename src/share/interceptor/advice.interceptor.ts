import {
  CallHandler,
  ExecutionContext, HttpStatus,
  Injectable,
  NestInterceptor
} from "@nestjs/common"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { ResultModel } from "../model/result.model"

@Injectable()
export class AdviceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => new ResultModel(HttpStatus.OK, undefined, data)))
  }
}
