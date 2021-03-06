import { Type } from "class-transformer"

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
  original_image_url?: string
}

export class AutoImageUrl {
  square_medium!: string
  medium!: string
  large!: string
  original!: string
}

export class AutoMetaPage {
  @Type(() => AutoImageUrl)
  image_urls!: AutoImageUrl
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
  @Type(() => AutoMetaPage)
  meta_pages!: AutoMetaPage[]
  total_view!: number
  total_bookmarks!: number
}
