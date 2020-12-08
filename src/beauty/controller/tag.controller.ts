import { Controller, Get, ParseIntPipe, Query } from "@nestjs/common"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { PictureDocumentService } from "../service/picture-document.service"
import { TagFrequencyVo } from "../vo/tag-frequency.vo"
import { TagPictureVo } from "../vo/tag-picture.vo"


@Controller("tag")
export class TagController {
  constructor(
    private readonly pictureDocumentService: PictureDocumentService
  ) {
  }

  @Get("listTagTop30")
  async listTagTop30(@CurrentUser() userInfo?: UserInfoEntity) {
    const buckets = await this.pictureDocumentService.listTagTop30(userInfo?.id)
    console.log(buckets)
    return buckets.map(it => new TagFrequencyVo(it.key, it.doc_count))
  }

  @Get("listTagAndPictureTop30")
  async listTagAndPictureTop30(@CurrentUser() userInfo?: UserInfoEntity) {
    const buckets = await this.pictureDocumentService.listTagTop30(userInfo?.id)
    const voList = []
    for (const bucket of buckets) {
      const picture = await this.pictureDocumentService.getFirstByTag(bucket.key, userInfo?.id)
      voList.push(new TagPictureVo(bucket.key, bucket.doc_count, picture.url))
    }
    return voList
  }

  @Get("listTagFrequencyByUserId")
  async listTagFrequencyByUserId(@CurrentUser() userInfo: UserInfoEntity | undefined, @Query("targetId", ParseIntPipe) targetId: number) {
    const buckets = await this.pictureDocumentService.listTagByUserId(targetId)
    return buckets.map(it => new TagFrequencyVo(it.key, it.doc_count))
  }
}
