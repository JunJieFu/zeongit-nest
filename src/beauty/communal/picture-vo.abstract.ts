import { PrivacyState } from "@/data/constant/privacy-state.constant"
import { PictureDocument } from "@/data/document/beauty/picture.document"
import { PermissionException } from "@/share/exception/permission.exception"
import { CollectionService } from "../service/collection.service"
import { PictureDocumentService } from "../service/picture-document.service"
import { PictureVo } from "../vo/picture.vo"
import { UserInfoVoAbstract } from "./user-info-vo.abstract"

export abstract class PictureVoAbstract extends UserInfoVoAbstract {
  abstract pictureDocumentService: PictureDocumentService

  abstract collectionService: CollectionService

  async getPictureVoById(pictureId: number, userInfoId?: number) {
    return this.getPictureVo(
      await this.pictureDocumentService.get(pictureId),
      userInfoId
    )
  }

  async getPictureVo(picture: PictureDocument, userInfoId?: number) {
    if (
      picture.privacy === PrivacyState.PRIVATE &&
      picture.createdBy !== userInfoId
    ) {
      throw new PermissionException("你没有权限查看该图片")
    }
    const pictureVo = new PictureVo(picture)
    pictureVo.focus = await this.collectionService.getCollectState(
      pictureVo.id!,
      userInfoId!
    )
    pictureVo.user = await this.getUserInfoVoById(picture.createdBy, userInfoId)
    return pictureVo
  }
}
