import { Column, Entity } from "typeorm"
import { BaseEntity } from "../../share/entity/base.entity"
import { UserState } from "../constant/user_state.constant"

@Entity("user")
export class UserEntity extends BaseEntity {

  @Column({ type: "varchar", length: 20 })
  phone: string

  @Column({ type: "varchar", length: 16 })
  password: string

  @Column({
    type: "enum",
    enum: ["NORMAL", "DISABLE"],
    default: "NORMAL"
  })
  state: UserState = "NORMAL"

  constructor(phone: string, password: string) {
    super()
    this.phone = phone
    this.password = password
  }
}
