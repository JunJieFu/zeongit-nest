import { CollectState } from "@/data/constant/collect-state.constant"
import { PictureLifeState } from "@/data/constant/picture-life-state.constant"
import { PrivacyState } from "@/data/constant/privacy-state.constant"
import { PictureDocument } from "@/data/document/beauty/picture.document"
import { UserInfoVo } from "./user-info.vo"

/**
 * 收藏图片的vo
 * @author fjj
 * 这里的id是图片的id，创建时间为收藏的创建时间
 */
export class CollectionPictureVo {
  id!: number

  url?: string

  life!: PictureLifeState

  privacy!: PrivacyState

  focus!: CollectState

  width!: number

  height!: number

  userInfo?: UserInfoVo

  updateDate?: Date

  constructor(
    picture: PictureDocument,
    focus: CollectState,
    updateDate: Date,
    userInfo?: UserInfoVo
  ) {
    this.id = picture.id
    this.url = picture.url
    this.privacy = picture.privacy ?? PrivacyState.PRIVATE
    this.width = picture.width ?? 0
    this.height = picture.height ?? 0
    this.updateDate = updateDate
    this.focus = focus
    this.userInfo = userInfo
  }
}
