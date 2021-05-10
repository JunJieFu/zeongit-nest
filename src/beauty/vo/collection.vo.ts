import { CollectState } from "@/data/constant/collect-state.constant"
import { CollectionEntity } from "@/data/entity/beauty/collection.entity"
import { PictureVo } from "./picture.vo"

/**
 * 收藏图片的vo
 * @author fjj
 */
export class CollectionPictureVo {
  id: number

  createDate: Date

  updateDate: Date

  pictureId: number

  focus: CollectState

  picture?: PictureVo

  constructor(
    collection: CollectionEntity,
    focus: CollectState,
    picture?: PictureVo
  ) {
    this.id = collection.id!
    this.createDate = collection.createDate!
    this.updateDate = collection.updateDate!
    this.pictureId = collection.pictureId!
    this.focus = focus
    this.picture = picture
  }
}
