import { Column, Entity } from "typeorm"
import { AskEntity } from "../../../share/entity/ask.entity"

/**
 * @author fjj
 */
@Entity("user_black_hole")
export class UserBlackHoleEntity extends AskEntity {

  @Column({ name: "target_id" })
  targetId: number

  constructor(userInfoId: number, targetId: number) {
    super(userInfoId)
    this.targetId = targetId
  }
}
