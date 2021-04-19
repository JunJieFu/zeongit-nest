import { Column, Entity } from "typeorm"
import { BaseEntity } from "../../../share/entity/base.entity"

@Entity("auto_pixiv_work")
export class AutoPixivWorkEntity extends BaseEntity {
  @Column({ name: "pixiv_id", unique: true })
  pixivId!: string
  @Column({ name: "title" })
  title!: string
  @Column({ name: "x_restrict", type: "int" })
  xRestrict = 0
  @Column({ name: "pixiv_restrict", type: "int" })
  pixivRestrict = 0
  @Column({ name: "description", type: "text", nullable: true })
  description?: string
  @Column({ name: "tags", nullable: true })
  tags?: string
  @Column({ name: "translate_tags", nullable: true })
  translateTags?: string
  @Column({ name: "user_id" })
  userId!: string
  @Column({ name: "user_name" })
  userName!: string
  @Column({ name: "width", type: "int" })
  width = 0
  @Column({ name: "height", type: "int" })
  height = 0
  @Column({ name: "page_count", type: "int" })
  pageCount = 0
  @Column({ name: "pixiv_create_date", nullable: true })
  pixivCreateDate?: Date
  @Column({ name: "original_url" })
  originalUrl!: string
  @Column({ name: "total_view", type: "int" })
  totalView = 0
  @Column({ name: "total_bookmarks", type: "int" })
  totalBookmarks = 0
  @Column({ name: "sl", nullable: true })
  sl?: number
  @Column({ name: "download", type: "int" })
  download = 0
  @Column({ name: "pixiv_use", type: "int" })
  pixivUse = 0
  @Column({ name: "collect_amount", type: "int" })
  collectAmount = 0
  @Column({ name: "url" })
  url!: string
}
