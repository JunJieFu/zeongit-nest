import { Column, Entity } from "typeorm"
import { BaseEntity } from "../../../share/entity/base.entity"

@Entity("pixiv_work")
export class PixivWorkEntity extends BaseEntity {
  @Column({ name: "illust_id" })
  illustId?: string
  @Column({ name: "illust_title" })
  illustTitle?: string
  @Column({ name: "pixiv_id", unique: true })
  pixivId?: string
  @Column({ name: "title" })
  title?: string
  @Column({ name: "illust_type" })
  illustType?: number
  @Column({ name: "x_restrict" })
  xRestrict?: number
  @Column({ name: "pixiv_restrict" })
  pixivRestrict ?: number
  @Column({ name: "sl" })
  sl?: number
  @Column({ name: "description", type: "text" })
  description?: string
  @Column({ name: "tags" })
  tags?: string
  @Column({ name: "translate_tags" })
  translateTags?: string
  @Column({ name: "user_id" })
  userId?: string
  @Column({ name: "user_name" })
  userName?: string
  @Column({ name: "width", type: "int" })
  width = 0
  @Column({ name: "height", type: "int" })
  height = 0
  @Column({ name: "page_count" })
  pageCount?: number
  @Column({ name: "bookmarkable" })
  bookmarkable ?: number
  @Column({ name: "ad_container" })
  adContainer ?: number
  @Column({ name: "pixiv_create_date" })
  pixivCreateDate?: Date
  @Column({ name: "pixiv_update_date" })
  pixivUpdateDate?: Date
  @Column({ name: "original_url" })
  originalUrl?: string
  @Column({ name: "download", type: "int" })
  download = 0
  @Column({ name: "all_url" })
  allUrl?: string
  @Column({ name: "proxy_url" })
  proxyUrl?: string
}
