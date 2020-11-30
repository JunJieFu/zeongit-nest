import { PictureDocument } from "../../data/document/beauty/picture.document"
import { UserInfoVo } from "./user-info.vo"
import { CollectState } from "../../data/constant/collect-state.constant"

export class PictureVo {
  id: number

  focus: CollectState = CollectState.STRANGE

  user!: UserInfoVo

  constructor(picture: PictureDocument) {
    this.id = picture.id
  }
}
