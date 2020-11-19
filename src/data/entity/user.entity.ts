import { Column, Entity } from "typeorm"
import { BaseEntity } from "../../share/entity/base.entity"
import { UserState } from "../constant/user_state.constant"

@Entity("user")
export class UserEntity extends BaseEntity {
  @Column({
    type: "enum",
    enum: ["NORMAL", "DISABLE"],
    default: "NORMAL"
  })
  state: UserState

  @Column()
  t: boolean

  constructor(state: UserState) {
    super()
    this.state = state
    this.t = true
  }
}
