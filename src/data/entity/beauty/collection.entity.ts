import { Column, Entity } from "typeorm"
import { AskEntity } from "../../../share/entity/ask.entity"

/**
 * @author fjj
 */
@Entity("collection")
export class CollectionEntity extends AskEntity {
  //被关注的人的id
  @Column({ name: "picture_id" })
  pictureId!: number

  constructor(userInfoId: number, pictureId: number) {
    super(userInfoId)
    this.pictureId = pictureId
  }
}
