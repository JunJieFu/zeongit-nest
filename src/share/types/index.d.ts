import { Observable } from "rxjs"

type NestResponse<T> = T | Promise<T> | Observable<T>

type NodeEnv = "development" | "production"
