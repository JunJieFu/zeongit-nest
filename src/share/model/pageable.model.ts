export class Pageable {
  page: number
  limit: number

  constructor(query: any, defaultData?: { size: number }) {
    this.page = Number(query.page ?? 1)
    this.limit = Number(query.size ?? defaultData?.size ?? 20)
  }
}
