import { UserBlackHoleVo } from "./user-black-hole.vo"
import { TagBlackHoleVo } from "./tag-black-hole.vo"
import { PictureBlackHoleVo } from "./picture-black-hole.vo"

export class BlackHoleVo {
  user: UserBlackHoleVo
  tagList: TagBlackHoleVo[]
  picture?: PictureBlackHoleVo

  constructor(
    user: UserBlackHoleVo,
    tagList: TagBlackHoleVo[],
    picture?: PictureBlackHoleVo
  ) {
    this.user = user
    this.tagList = tagList
    this.picture = picture
  }
}
