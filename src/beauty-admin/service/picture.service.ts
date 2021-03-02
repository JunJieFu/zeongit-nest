import { Injectable, NotFoundException } from "@nestjs/common"
import { Like, Not, Repository } from "typeorm"
import { PictureEntity } from "../../data/entity/beauty/picture.entity"
import { nullable } from "../../share/fragment/pipe.function"
import { PictureLifeState } from "../../data/constant/picture-life-state.constant"
import { InjectBeauty } from "../../data/decorator/inject-beauty.decorator"

@Injectable()
export class PictureService {
  constructor(
    @InjectBeauty(PictureEntity)
    private readonly pictureRepository: Repository<PictureEntity>) {
  }

  getByUrl(url: string) {
    return this.pictureRepository.findOne({ url }).then(nullable("图片不存在"))
  }

  save(picture: PictureEntity, force = false) {
    if (picture.life === PictureLifeState.DISAPPEAR && !force) {
      throw new NotFoundException("图片不存在")
    }
    return this.pictureRepository.save(picture)
  }

  list() {
    return this.pictureRepository.find()
  }

  remove(picture: PictureEntity) {
    return this.pictureRepository.remove(picture)
  }

  listSuit() {
    return this.pictureRepository.find({
      where: {
        url: Not(Like("%_p0%"))
      }
    })
  }
}
