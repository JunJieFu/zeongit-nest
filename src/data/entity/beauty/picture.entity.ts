import { PictureLifeState } from "@/data/constant/picture-life-state.constant"
import { PictureState } from "@/data/constant/picture-state.constant"
import { PrivacyState } from "@/data/constant/privacy-state.constant"
import { AskEntity } from "@/share/entity/ask.entity"
import { Column, Entity, OneToMany } from "typeorm"
import { TagEntity } from "./tag.entity"

@Entity("picture")
export class PictureEntity extends AskEntity {
  //图片地址
  @Column({ name: "url" })
  url!: string

  //图片名称
  @Column({ name: "name" })
  name: string

  //图片简介
  @Column({ name: "introduction", type: "text" })
  introduction: string

  //是否公开
  @Column({
    name: "privacy",
    type: "int"
  })
  privacy: PrivacyState = PrivacyState.PUBLIC

  //图片状态
  @Column({
    name: "state",
    type: "int"
  })
  state: PictureState = PictureState.NORMAL

  //是否存在，不存在不建立索引
  @Column({
    name: "life",
    type: "int"
  })
  life: PictureLifeState = PictureLifeState.EXIST

  //宽度
  @Column({ name: "width" })
  width: number

  //高度
  @Column({ name: "height" })
  height: number

  @OneToMany(
    () => TagEntity,
    (tag) => tag.picture,
    {
      eager: true,
      cascade: true,
      nullable: false
    }
  )
  tagList?: TagEntity[]

  constructor(
    userInfoId: number,
    url: string,
    width: number,
    height: number,
    name?: string,
    introduction?: string,
    privacy: PrivacyState = PrivacyState.PUBLIC
  ) {
    super(userInfoId)
    this.url = url
    this.name = name ?? "镜花水月"
    this.introduction = introduction ?? "镜花水月"
    this.width = width
    this.height = height
    this.privacy = privacy
  }
}
