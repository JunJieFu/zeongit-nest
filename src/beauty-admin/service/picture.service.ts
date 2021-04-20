import { PictureLifeState } from "@/data/constant/picture-life-state.constant"
import { InjectBeauty } from "@/data/decorator/inject-beauty.decorator"
import { PictureDocument } from "@/data/document/beauty/picture.document"
import { PictureEntity } from "@/data/entity/beauty/picture.entity"
import { nullable } from "@/share/fragment/pipe.function"
import { Injectable, NotFoundException } from "@nestjs/common"
import { Repository } from "typeorm"
import { PictureDocumentService } from "./picture-document.service"

@Injectable()
export class PictureService {
  constructor(
    @InjectBeauty(PictureEntity)
    private readonly pictureRepository: Repository<PictureEntity>,
    private readonly pictureDocumentService: PictureDocumentService
  ) {}

  getByUrl(url: string) {
    return this.pictureRepository.findOne({ url }).then(nullable("图片不存在"))
  }

  async save(picture: PictureEntity, force = false) {
    if (picture.life === PictureLifeState.DISAPPEAR && !force) {
      throw new NotFoundException("图片不存在")
    }
    return this.pictureDocumentService.save(
      new PictureDocument(await this.pictureRepository.save(picture))
    )
  }

  list() {
    return this.pictureRepository.find()
  }

  remove(picture: PictureEntity) {
    return this.pictureRepository.remove(picture)
  }
}
