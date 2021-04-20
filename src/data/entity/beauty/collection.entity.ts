import { AskEntity } from "@/share/entity/ask.entity"
import { Column, Entity, Index } from "typeorm"

/**
 * @author fjj
 */
@Entity("collection")
@Index(["pictureId", "createdBy"], { unique: true })
export class CollectionEntity extends AskEntity {
  //被关注的人的id
  @Column({ name: "picture_id" })
  pictureId!: number

  constructor(userInfoId: number, pictureId: number) {
    super(userInfoId)
    this.pictureId = pictureId
  }
}
