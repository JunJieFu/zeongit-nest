import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { PictureEntity } from "../../data/entity/beauty/picture.entity"
import { PictureLifeState } from "../../data/constant/picture-life-state.constant"
import { NotFoundException } from "@nestjs/common"
import { PictureDocumentService } from "./picture-document.service"
import { PictureDocument } from "../../data/document/beauty/picture.document"

export class PictureService {
  constructor(
    @InjectRepository(PictureEntity)
    private readonly pictureRepository: Repository<PictureEntity>,
    private readonly pictureDocumentService: PictureDocumentService
  ) {
  }

  async save(picture: PictureEntity, force = false) {
    if (picture.life == PictureLifeState.DISAPPEAR && !force) {
      throw new NotFoundException("图片不存在")
    }
    return this.pictureDocumentService.save(new PictureDocument(await this.pictureRepository.save(picture)))
  }
}
