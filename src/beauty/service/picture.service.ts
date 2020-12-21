import { Repository } from "typeorm"
import { PictureEntity } from "../../data/entity/beauty/picture.entity"
import { PictureLifeState } from "../../data/constant/picture-life-state.constant"
import { NotFoundException } from "@nestjs/common"
import { PictureDocumentService } from "./picture-document.service"
import { PictureDocument } from "../../data/document/beauty/picture.document"
import { nullable } from "../../share/fragment/pipe.function"
import { PermissionException } from "src/share/exception/permission.exception"
import { PrivacyState } from "../../data/constant/privacy-state.constant"
import { InjectBeauty } from "../../data/decorator/inject-beauty.decorator"
import { TagService } from "./tag.service"

export class PictureService {
  constructor(
    @InjectBeauty(PictureEntity)
    private readonly pictureRepository: Repository<PictureEntity>,
    private readonly pictureDocumentService: PictureDocumentService,
    private readonly tagService: TagService
  ) {
  }

  async del(id: number) {
    return this.pictureRepository.delete({ id })
  }

  async save(picture: PictureEntity, force = false) {
    if (picture.life === PictureLifeState.DISAPPEAR && !force) {
      throw new NotFoundException("图片不存在")
    }
    if (picture.id) {
      await this.tagService.remove(picture.id)
    }
    return this.pictureDocumentService.save(new PictureDocument(await this.pictureRepository.save(picture)))
  }

  async getSelf(id: number, userInfoId: number) {
    const picture = await this.get(id)
    if (picture.createdBy != userInfoId) {
      throw new PermissionException("您无权操作该图片")
    }
    return picture
  }

  async getByLife(id: number, life: PictureLifeState) {
    return this.pictureRepository.findOne({ where: { id, life } }).then(nullable("图片不存在"))
  }

  get(id: number) {
    return this.getByLife(id, PictureLifeState.EXIST)
  }

  async hide(picture: PictureEntity) {
    switch (picture.privacy) {
      case PrivacyState.PRIVATE :
        picture.privacy = PrivacyState.PUBLIC
        break
      case PrivacyState.PUBLIC :
        picture.privacy = PrivacyState.PRIVATE
        break
    }
    await this.save(picture)
    return picture.privacy
  }

  async remove(picture: PictureEntity) {
    picture.life = PictureLifeState.DISAPPEAR
    await this.save(picture, true)
    await this.pictureDocumentService.remove(picture.id!)
  }

  async synchronizationIndexPicture() {
    return this.pictureDocumentService.synchronizationIndexPicture(await this.pictureRepository.find())
  }
}
