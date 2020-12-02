import { PictureDocument } from "../../data/document/beauty/picture.document"
import { UserInfoVo } from "./user-info.vo"
import { CollectState } from "../../data/constant/collect-state.constant"

export class PictureVo {
  id: number

  focus: CollectState = CollectState.STRANGE

  user!: UserInfoVo

  name!: string

  url!: string

  #tagList: string[]

  get tagList() {
    return this.#tagList.filter(it => it !== "")
  }

  constructor(picture: PictureDocument) {
    this.id = picture.id
    this.#tagList = picture.tagList
    this.name = picture.name
    this.url = picture.url
  }
}
