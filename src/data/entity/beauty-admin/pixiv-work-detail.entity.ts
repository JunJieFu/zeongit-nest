import { BaseEntity } from "../../../share/entity/base.entity"
import { Column, Entity } from "typeorm"

@Entity("pixiv_work_detail")
export class PixivWorkDetailEntity extends BaseEntity {
  @Column({ name: "pixiv_id", nullable: true })
  pixivId?: string
  @Column({ name: "name" })
  name: string
  @Column({ name: "url" })
  url: string
  @Column({ name: "proxy_url" })
  proxyUrl: string
  @Column({ name: "x_restrict", nullable: true })
  xRestrict?: number
  @Column({ name: "pixiv_restrict", nullable: true })
  pixivRestrict ?: number
  @Column({ name: "width", type: "int" })
  width = 0
  @Column({ name: "height", type: "int" })
  height = 0
  @Column({ name: "download", type: "int" })
  download = 0
  @Column({ name: "pixiv_using", type: "int" })
  using = 0

  constructor(
    pixivId: string,
    name: string,
    url: string,
    proxyUrl: string,
    xRestrict: number,
    pixivRestrict: number
  ) {
    super()
    this.pixivId = pixivId
    this.name = name
    this.url = url
    this.proxyUrl = proxyUrl
    this.xRestrict = xRestrict
    this.pixivRestrict = pixivRestrict
  }
}
