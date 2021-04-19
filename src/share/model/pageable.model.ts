import { SortOrder } from "../constant/sort-order.constant"
import { IsEnum, IsString } from "class-validator"
import { plainToClass } from "class-transformer"
import { PaginationMeta } from "../types"

export class Sort {
  @IsString()
  key: string
  @IsEnum(SortOrder)
  order: SortOrder

  constructor(key: string, order: SortOrder) {
    this.key = key
    this.order = order
  }
}

export class Pageable {
  page: number
  limit: number
  sort: Sort[] = []

  constructor(
    query: { page?: number; limit?: number; sort?: string | string[] | Sort[] },
    defaultData?: { limit: number }
  ) {
    this.page = Number(query?.page ?? 1)
    this.limit = Number(query?.limit ?? defaultData?.limit ?? 20)
    const sort = query?.sort
    if (sort) {
      if (Array.isArray(sort)) {
        for (const item of sort) {
          if (typeof item === "string") {
            const sortItemList = item.split(",")

            this.sort.push(
              plainToClass(Sort, {
                key: sortItemList[0],
                order: sortItemList[1]
              })
            )
          } else {
            this.sort.push(item)
          }
        }
      } else {
        const sortItemList = sort.split(",")
        this.sort.push(
          plainToClass(Sort, {
            key: sortItemList[0],
            order: sortItemList[1]
          })
        )
      }
    }
  }
}

export class PaginationAdvance<T> {
  items: T[]
  meta: PaginationMeta

  constructor(items: T[], meta: PaginationMeta) {
    this.items = items
    this.meta = meta
  }
}
