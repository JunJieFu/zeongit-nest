import { AskEntity } from "@/share/entity/ask.entity"
import { Column, Entity } from "typeorm"

/**
 * @author fjj
 */
@Entity("picture_black_hole")
export class PictureBlackHoleEntity extends AskEntity {
  @Column({ name: "target_id" })
  targetId: number

  constructor(userInfoId: number, targetId: number) {
    super(userInfoId)
    this.targetId = targetId
  }
}
