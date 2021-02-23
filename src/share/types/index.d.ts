import { Observable } from "rxjs"

type NestResponse<T> = T | Promise<T> | Observable<T>

type NodeEnv = "development" | "production"

interface PaginationMeta{
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  empty: boolean;
  first: boolean;
  last: boolean;
}
