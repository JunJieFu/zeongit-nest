import { AspectRatio } from "@/data/constant/aspect-ratio.constant"
import { PrivacyState } from "@/data/constant/privacy-state.constant"
import { PictureEntity } from "@/data/entity/beauty/picture.entity"


export class PictureDocument {
  id!: number
  url!: string
  name!: string
  introduction!: string
  privacy!: PrivacyState
  viewAmount = 0
  likeAmount = 0
  width!: number
  height!: number
  aspectRatio!: AspectRatio
  ratio!: number
  tagList!: string[]
  createdBy!: number
  createDate!: Date
  updateDate!: Date

  constructor(picture: PictureEntity) {
    if (picture) {
      const { width, height } = picture
      this.id = picture.id!
      this.url = picture.url
      this.name = picture.name
      this.introduction = picture.introduction
      this.privacy = picture.privacy
      this.width = picture.width
      this.height = picture.height
      this.ratio = picture.width / picture.height
      this.tagList = picture.tagList?.map((it) => it.name) ?? []
      this.createdBy = picture.createdBy!
      this.createDate = picture.createDate!
      this.updateDate = picture.updateDate!
      if (width > height) {
        this.aspectRatio = AspectRatio.HORIZONTAL
      } else if (width < height) {
        this.aspectRatio = AspectRatio.VERTICAL
      } else {
        this.aspectRatio = AspectRatio.SQUARE
      }
    }
  }
}
