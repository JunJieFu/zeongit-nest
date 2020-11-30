import { UserInfoVoAbstract } from "./user-info-vo.abstract"
import { PictureDocumentService } from "../service/picture-document.service"
import { CollectionService } from "../service/collection.service"
import { PictureDocument } from "../../data/document/beauty/picture.document"
import { PictureVo } from "../vo/picture.vo"
import { PrivacyState } from "../../data/constant/privacy-state.constant"
import { PermissionException } from "../../share/exception/permission.exception"
import { map, mergeMap } from "rxjs/operators"

export abstract class PictureVoAbstract extends UserInfoVoAbstract {
  abstract pictureDocumentService: PictureDocumentService

  abstract collectionService: CollectionService

  getPictureVoById(pictureId: number, userId?: number) {
    return this.pictureDocumentService.get(pictureId).pipe(
      mergeMap((it) => {
        return this.getPictureVo(it, userId)
      })
    )
  }

  getPictureVo(picture: PictureDocument, userId?: number) {
    if (picture.privacy == PrivacyState.PRIVATE && picture.createdBy !== userId) {
      throw new PermissionException("你没有权限查看该图片")
    }
    const pictureVo = new PictureVo(picture)
    return this.collectionService.exists(pictureVo.id!, userId!).pipe(
      mergeMap(it => {
          pictureVo.focus = it
          return this.getUserInfoVoById(picture.createdBy, userId)
        }
      ),
      map(it => {
        pictureVo.user = it
        return pictureVo
      })
    )
  }
}
