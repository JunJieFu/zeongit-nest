import { ReadState } from "@/data/constant/read-state.conatnat"
import { AskEntity } from "@/share/entity/ask.entity"
import { Column, Entity } from "typeorm"

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
    type: "int"
  })
  state: ReadState = ReadState.WAIT

  constructor(content: string, email?: string, userInfoId?: number) {
    super(userInfoId)
    this.email = email
    this.content = content
  }
}
