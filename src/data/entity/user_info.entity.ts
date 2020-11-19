import { BaseEntity } from "../../share/entity/base.entity"
import { Column, Entity } from "typeorm"
import { UserState } from "../constant/user_state.constant"
import { Gender } from "../constant/gender.constant"

@Entity("user_info")
export class UserInfoEntity extends BaseEntity {
  @Column()
  userId: number

  @Column({
    type: "enum",
    enum: ["MALE", "FEMALE", "UNKNOWN", "INCONVENIENT"],
    default: "INCONVENIENT"
  })
  gender: Gender = "INCONVENIENT"

  @Column()
  birthday: Date = new Date()

  @Column()
  nickname: string

  @Column()
  introduction: string

  @Column({ nullable: true })
  country?: string

  @Column({ nullable: true })
  province?: string

  @Column({ nullable: true })
  city?: string

  @Column({ nullable: true })
  avatarUrl?: string

  @Column({ nullable: true })
  background?: string

  @Column({
    type: "enum",
    enum: ["NORMAL", "DISABLE"],
    default: "NORMAL"
  })
  state: UserState = "NORMAL"

  constructor(userId: number, nickname: string, introduction: string) {
    super()
    this.userId = userId
    this.nickname = nickname
    this.introduction = introduction
  }
}
