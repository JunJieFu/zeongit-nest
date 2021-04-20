import { Observable } from "rxjs"

export type NestResponse<T> = T | Promise<T> | Observable<T>

export type NodeEnv = "development" | "production"

export interface PaginationMeta {
  itemCount: number
  totalItems: number
  itemsPerPage: number
  totalPages: number
  currentPage: number
  empty: boolean
  first: boolean
  last: boolean
}
