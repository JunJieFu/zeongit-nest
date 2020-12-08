import { Injectable } from "@nestjs/common"
import { InjectBeauty } from "../../data/decorator/inject-beauty.decorator"
import { Repository } from "typeorm"
import { TagEntity } from "../../data/entity/beauty/tag.entity"

@Injectable()
export class TagService {
  constructor(@InjectBeauty(TagEntity)
              private readonly pictureRepository: Repository<TagEntity>
  ) {
  }

  remove(pictureId: number) {
    return this.pictureRepository.delete({
      picture: { id: pictureId }
    })
  }
}
