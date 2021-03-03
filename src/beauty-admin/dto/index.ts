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

export class AutoCollectUser {
  id!: number
  name!: string
  account!: string
}

export class AutoCollectTag {
  name?: string
  translated_name?: string
}

export class AutoCollectSingle {
  original_image_url!: string
}

export class AutoCollectPick {
  @Type(() => AutoCollect)
  illusts!: AutoCollect[]
}

export class AutoCollect {
  id!: number
  title!: string
  type!: string
  caption!: string
  restrict!: number
  @Type(() => AutoCollectUser)
  user!: AutoCollectUser
  @Type(() => AutoCollectTag)
  tags!: AutoCollectTag[]
  @Type(() => Date)
  create_date!: Date
  page_count!: number
  width!: number
  height!: number
  sanity_level!: number
  x_restrict!: number
  @Type(() => AutoCollectSingle)
  meta_single_page!: AutoCollectSingle
  total_view!: number
  total_bookmarks!: number
}


