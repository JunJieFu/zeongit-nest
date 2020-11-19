import { BaseEntity } from "../../share/entity/base.entity"
import { Column, Entity } from "typeorm"
import { UserState } from "../constant/user_state.constant"

@Entity("user_info")
export class UserInfoEntity extends BaseEntity {
  @Column({
    type: "enum",
    enum: ["NORMAL", "DISABLE"],
    default: "NORMAL"
  })
  state: UserState
  constructor(state: UserState) {
    super()
    this.state = state
  }
}
