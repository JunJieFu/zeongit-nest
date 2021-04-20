import { UserState } from "@/data/constant/user-state.constant"
import { BaseEntity } from "@/share/entity/base.entity"
import { Column, Entity } from "typeorm"
@Entity("user")
export class UserEntity extends BaseEntity {
  @Column({ name: "phone", type: "varchar", length: 20, unique: true })
  phone: string

  @Column({ type: "varchar", length: 16 })
  password: string

  @Column({
    name: "state",
    type: "int"
  })
  state: UserState = UserState.NORMAL

  constructor(phone: string, password: string) {
    super()
    this.phone = phone
    this.password = password
  }
}
