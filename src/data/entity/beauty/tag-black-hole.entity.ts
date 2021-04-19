import { Column, Entity } from "typeorm"
import { AskEntity } from "../../../share/entity/ask.entity"

/**
 * @author fjj
 */
@Entity("tag_black_hole")
export class TagBlackHoleEntity extends AskEntity {
  @Column({ name: "tag" })
  tag: string

  constructor(userInfoId: number, tag: string) {
    super(userInfoId)
    this.tag = tag
  }
}
