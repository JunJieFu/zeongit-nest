import { CollectState } from "@/data/constant/collect-state.constant"
import { FootprintEntity } from "@/data/entity/beauty/footprint.entity"
import { PictureVo } from "./picture.vo"

/**
 * 足迹图片的vo
 * @author fjj
 */
export class FootprintPictureVo {
  id: number

  createDate: Date

  updateDate: Date

  pictureId: number

  focus: CollectState

  picture?: PictureVo

  constructor(
    footprint: FootprintEntity,
    focus: CollectState,
    picture?: PictureVo
  ) {
    this.id = footprint.id!
    this.createDate = footprint.createDate!
    this.updateDate = footprint.updateDate!
    this.pictureId = footprint.pictureId!
    this.focus = focus
    this.picture = picture
  }
}