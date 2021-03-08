import { Column, Entity } from "typeorm"
import { BaseEntity } from "../../../share/entity/base.entity"

@Entity("pixiv_following")
export class PixivFollowingEntity extends BaseEntity {
  @Column({ name: "user_id", unique: true })
  userId!: string
  @Column({ name: "page", type: "int" })
  page = 0
}
