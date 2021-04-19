import { Type } from "class-transformer"

export class WorkDto {
  illustId?: string
  illustTitle?: string
  id?: string
  title?: string
  illustType = 0
  xRestrict = 0
  restrict = 0
  sl = 0
  url?: string
  description?: string
  tags?: string[]
  userId?: string
  userName?: string
  width = 0
  height = 0
  pageCount = 0
  isBookmarkable = false
  isAdContainer = false
  @Type(() => Date)
  createDate?: Date
  @Type(() => Date)
  updateDate?: Date
  profileImageUrl?: string
}

export class CollectDto {
  @Type(() => WorkDto)
  works!: WorkDto[]

  total!: number
}

export class UpdateOriginalUrlDto {
  description?: string
  originalUrl?: string
  translateTags?: string
  pixivId?: string
}
