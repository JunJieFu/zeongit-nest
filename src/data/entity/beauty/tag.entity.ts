import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { AskEntity } from "../../../share/entity/ask.entity"
import { PictureEntity } from "./picture.entity"

@Entity("tag")
export class TagEntity extends AskEntity {
  //图片名称
  @Column({ name: "name" })
  name: string

  //图片简介
  @ManyToOne(() => PictureEntity, picture => picture.tagList)
  @JoinColumn({ name: "picture_id" })
  picture!: PictureEntity

  constructor(userInfoId: number, name: string) {
    super(userInfoId)
    this.name = name
  }
}
