import { AskEntity } from "@/share/entity/ask.entity"
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { PictureEntity } from "./picture.entity"

@Entity("tag")
// @Index(["name", "picture"], { unique: true })
export class TagEntity extends AskEntity {
  //图片名称
  @Column({ name: "name" })
  name: string

  //图片简介
  @ManyToOne(
    () => PictureEntity,
    (picture) => picture.tagList,
    { onUpdate: "CASCADE", onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "picture_id" })
  picture!: PictureEntity

  constructor(userInfoId: number, name: string) {
    super(userInfoId)
    this.name = name
  }
}
