import { BaseEntity } from "../../../share/entity/base.entity"
import { Column, Entity } from "typeorm"
import { UserState } from "../../constant/user-state.constant"
import { Gender } from "../../constant/gender.constant"
import { UserInitState } from "../../constant/user-info-state.constant"

@Entity("user_info")
export class UserInfoEntity extends BaseEntity {
  @Column({ name: "user_id", unique: true })
  userId: number

  @Column({
    name: "gender",
    type: "int"
  })
  gender: Gender = Gender.INCONVENIENT

  @Column({ name: "birthday" })
  birthday: Date = new Date()

  @Column({ name: "nickname" })
  nickname: string

  @Column({ name: "introduction" })
  introduction: string

  @Column({ name: "country", nullable: true })
  country?: string

  @Column({ name: "province", nullable: true })
  province?: string

  @Column({ name: "city", nullable: true })
  city?: string

  @Column({ name: "avatar", nullable: true })
  avatar?: string

  @Column({ name: "background", nullable: true })
  background?: string

  @Column({
    name: "state",
    type: "int"
  })
  state: UserInitState = UserInitState.WAIT

  @Column({
    name: "user_state",
    type: "int"
  })
  userState: UserState = UserState.NORMAL

  constructor(userId: number, nickname: string, introduction: string) {
    super()
    this.userId = userId
    this.nickname = nickname
    this.introduction = introduction
  }
}
