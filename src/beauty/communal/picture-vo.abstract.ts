import { UserInfoVoAbstract } from "./user-info-vo.abstract"
import { PictureDocumentService } from "../service/picture-document.service"
import { CollectionService } from "../service/collection.service"
import { PictureDocument } from "../../data/document/beauty/picture.document"
import { PictureVo } from "../vo/picture.vo"
import { PrivacyState } from "../../data/constant/privacy-state.constant"
import { PermissionException } from "../../share/exception/permission.exception"

export abstract class PictureVoAbstract extends UserInfoVoAbstract {
  abstract pictureDocumentService: PictureDocumentService

  abstract collectionService: CollectionService

  async getPictureVoById(pictureId: number, userId?: number) {
    return this.getPictureVo(await this.pictureDocumentService.get(pictureId), userId)
  }

  async getPictureVo(picture: PictureDocument, userId?: number) {
    if (picture.privacy == PrivacyState.PRIVATE && picture.createdBy !== userId) {
      throw new PermissionException("你没有权限查看该图片")
    }
    const pictureVo = new PictureVo(picture)
    pictureVo.focus = await this.collectionService.getCollectState(pictureVo.id!, userId!)
    pictureVo.user = await this.getUserInfoVoById(picture.createdBy, userId)
    return pictureVo
  }
}
