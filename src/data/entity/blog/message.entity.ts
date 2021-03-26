import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../../share/entity/base.entity";

@Entity("message")
export class MessageEntity extends BaseEntity {
  @Column({name: "name", nullable: true})
  name?: string
  @Column({name: "email", nullable: true})
  email?: string
  @Column({name: "content", type: "text"})
  content!: string

  constructor(content: string, name?: string, email?: string) {
    super();
    this.content = content
    this.name = name
    this.email = email
  }
}
