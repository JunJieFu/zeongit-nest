import { PictureDocument } from "../../data/document/beauty/picture.document"
import { UserInfoVo } from "./user-info.vo"
import { CollectState } from "../../data/constant/collect-state.constant"
import { PrivacyState } from "../../data/constant/privacy-state.constant"
import { AspectRatio } from "../../data/constant/aspect-ratio.constant"

export class PictureVo {
  id: number

  name!: string

  introduction!: string

  privacy!: PrivacyState

  viewAmount!: number

  likeAmount!: number

  width!: number

  height!: number

  url!: string

  aspectRatio!: AspectRatio

  tagList: string[]

  focus: CollectState = CollectState.STRANGE

  user!: UserInfoVo

  constructor(picture: PictureDocument) {
    this.id = picture.id
    this.tagList = picture.tagList
    this.name = picture.name
    this.introduction = picture.introduction
    this.privacy = picture.privacy
    this.viewAmount = picture.viewAmount
    this.likeAmount = picture.likeAmount
    this.width = picture.width
    this.height = picture.height
    this.aspectRatio = picture.aspectRatio
    this.url = picture.url
  }
}
