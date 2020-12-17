import { BaseEntity } from "../../../share/entity/base.entity"
import { Column, Entity } from "typeorm"

@Entity("pixiv_error")
export class PixivErrorEntitiy extends BaseEntity {
  @Column({ name: "pixiv_id" })
  pixivId: string
  @Column({ name: "message" })
  message?: string

  constructor(
    pixivId: string,
    message?: string
  ) {
    super()
    this.pixivId = pixivId
    this.message = message
  }
}
