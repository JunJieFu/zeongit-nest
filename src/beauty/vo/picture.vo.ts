import { AspectRatio } from "@/data/constant/aspect-ratio.constant"
import { CollectState } from "@/data/constant/collect-state.constant"
import { PrivacyState } from "@/data/constant/privacy-state.constant"
import { PictureDocument } from "@/data/document/beauty/picture.document"
import { UserInfoVo } from "./user-info.vo"

export class PictureVo {
  id: number

  createDate: Date

  updateDate: Date

  name!: string

  introduction!: string

  privacy!: PrivacyState

  viewAmount!: number

  likeAmount!: number

  width!: number

  height!: number

  url!: string

  aspectRatio!: AspectRatio

  ratio!: number

  tagList: string[]

  focus: CollectState = CollectState.STRANGE

  user!: UserInfoVo

  constructor(picture: PictureDocument) {
    this.id = picture.id
    this.createDate = picture.createDate
    this.updateDate = picture.updateDate
    this.tagList = picture.tagList.filter((it) => it !== "")
    this.name = picture.name
    this.introduction = picture.introduction
    this.privacy = picture.privacy
    this.viewAmount = picture.viewAmount
    this.likeAmount = picture.likeAmount
    this.width = picture.width
    this.height = picture.height
    this.aspectRatio = picture.aspectRatio
    this.ratio = picture.ratio
    this.url = picture.url
  }
}
