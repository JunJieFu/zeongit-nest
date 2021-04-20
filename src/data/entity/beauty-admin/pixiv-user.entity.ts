import { BaseEntity } from "@/share/entity/base.entity"
import { Column, Entity } from "typeorm"

@Entity("pixiv_user")
export class PixivUserEntity extends BaseEntity {
  @Column({ name: "user_info_id", unique: true })
  userInfoId: number

  @Column({ name: "pixiv_user_id", length: 20, unique: true })
  pixivUserId: string

  constructor(userInfoId: number, pixivUserId: string) {
    super()
    this.userInfoId = userInfoId
    this.pixivUserId = pixivUserId
  }
}
