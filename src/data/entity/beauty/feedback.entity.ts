import { Column, Entity } from "typeorm"
import { AskEntity } from "../../../share/entity/ask.entity"
import { ReadState } from "../../constant/read-state.conatnat"

/**
 * @author fjj
 */
@Entity("feedback")
export class FeedbackEntity extends AskEntity {

  @Column({ name: "email" })
  email?: string

  @Column({ name: "content", type: "text" })
  content: string

  @Column({
    name: "state",
    type: "enum",
    enum: ReadState
  })
  state: ReadState = ReadState.WAIT

  constructor(content: string, email?: string, userInfoId?: number) {
    super(userInfoId)
    this.email = email
    this.content = content
  }
}
