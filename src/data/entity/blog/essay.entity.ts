import { BaseEntity } from "@/share/entity/base.entity"
import { Column, Entity } from "typeorm"

@Entity("essay")
export class EssayEntity extends BaseEntity {
  @Column({ name: "image", nullable: true })
  image?: string
  @Column({ name: "content", type: "text" })
  content!: string

  constructor(content: string, image?: string) {
    super()
    this.content = content
    this.image = image
  }
}
