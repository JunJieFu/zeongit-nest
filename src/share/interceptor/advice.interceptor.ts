import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor
} from "@nestjs/common"
import { Pagination } from "nestjs-typeorm-paginate"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { PaginationAdvance } from "../model/pageable.model"
import { Result } from "../model/result.model"

@Injectable()
export class AdviceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof Pagination) {
          const empty = data.meta.itemCount === 0
          const first = data.meta.currentPage === 1
          const last = data.meta.totalPages <= data.meta.currentPage

          return new PaginationAdvance(
            data.items,
            Object.assign(data.meta, {
              empty,
              first,
              last
            })
          )
        }
        return data
      }),
      map((data) => new Result(HttpStatus.OK, undefined, data))
    )
  }
}
