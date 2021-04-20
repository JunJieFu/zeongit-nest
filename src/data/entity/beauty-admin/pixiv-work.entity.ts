import { BaseEntity } from "@/share/entity/base.entity"
import { Column, Entity } from "typeorm"

@Entity("pixiv_work")
export class PixivWorkEntity extends BaseEntity {
  @Column({ name: "illust_id", nullable: true })
  illustId?: string
  @Column({ name: "illust_title", nullable: true })
  illustTitle?: string
  @Column({ name: "pixiv_id", unique: true, nullable: true })
  pixivId?: string
  @Column({ name: "title", nullable: true })
  title?: string
  @Column({ name: "illust_type", nullable: true })
  illustType?: number
  @Column({ name: "x_restrict", type: "int" })
  xRestrict = 0
  @Column({ name: "pixiv_restrict", type: "int" })
  pixivRestrict = 0
  @Column({ name: "sl", nullable: true })
  sl?: number
  @Column({ name: "description", type: "text", nullable: true })
  description?: string
  @Column({ name: "tags", nullable: true })
  tags?: string
  @Column({ name: "translate_tags", nullable: true })
  translateTags?: string
  @Column({ name: "user_id", nullable: true })
  userId?: string
  @Column({ name: "user_name", nullable: true })
  userName?: string
  @Column({ name: "width", type: "int" })
  width = 0
  @Column({ name: "height", type: "int" })
  height = 0
  @Column({ name: "page_count", type: "int" })
  pageCount = 0
  @Column({ name: "bookmarkable", nullable: true })
  bookmarkable?: number
  @Column({ name: "ad_container", nullable: true })
  adContainer?: number
  @Column({ name: "pixiv_create_date", nullable: true })
  pixivCreateDate?: Date
  @Column({ name: "pixiv_update_date", nullable: true })
  pixivUpdateDate?: Date
  @Column({ name: "original_url", nullable: true })
  originalUrl?: string
  @Column({ name: "download", type: "int" })
  download = 0
}
