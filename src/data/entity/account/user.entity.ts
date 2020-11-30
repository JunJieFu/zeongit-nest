import { Column, Entity } from "typeorm"
import { BaseEntity } from "../../../share/entity/base.entity"
import { UserState } from "../../constant/user-state.constant"

@Entity("user")
export class UserEntity extends BaseEntity {
  @Column({ name: "phone", type: "varchar", length: 20, unique: true })
  phone: string

  @Column({ type: "varchar", length: 16 })
  password: string

  @Column({
    name: "state",
    type: "enum",
    enum: UserState
  })
  state: UserState = UserState.NORMAL

  constructor(phone: string, password: string) {
    super()
    this.phone = phone
    this.password = password
  }
}
