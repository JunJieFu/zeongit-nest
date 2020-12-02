import { Column, Entity, Index } from "typeorm"
import { AskEntity } from "../../../share/entity/ask.entity"

/**
 * @author fjj
 */
@Entity("footprint")
@Index(["picture_id", "created_by"], { unique: true })
export class FootprintEntity extends AskEntity {
  //被关注的人的id
  @Column({ name: "picture_id" })
  pictureId!: number

  constructor(userInfoId: number, pictureId: number) {
    super(userInfoId)
    this.pictureId = pictureId
  }
}
