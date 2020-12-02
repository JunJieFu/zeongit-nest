import { Column, Entity, Index } from "typeorm"
import { AskEntity } from "../../../share/entity/ask.entity"
import { ReadState } from "../../constant/read-state.conatnat"

/**
 * @author fjj
 */
@Entity("complaint")
@Index(["picture_id", "created_by"], { unique: true })
export class ComplaintEntity extends AskEntity {
  //被关注的人的id
  @Column({ name: "picture_id" })
  pictureId: number

  @Column({ name: "content", type: "text" })
  content: string

  @Column({
    name: "state",
    type: "enum",
    enum: ReadState
  })
  state: ReadState = ReadState.WAIT

  constructor(userInfoId: number, pictureId: number, content: string) {
    super(userInfoId)
    this.pictureId = pictureId
    this.content = content
  }
}
