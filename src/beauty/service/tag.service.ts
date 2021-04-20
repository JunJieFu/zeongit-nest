import { InjectBeauty } from "@/data/decorator/inject-beauty.decorator"
import { TagEntity } from "@/data/entity/beauty/tag.entity"
import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"

@Injectable()
export class TagService {
  constructor(
    @InjectBeauty(TagEntity)
    private readonly pictureRepository: Repository<TagEntity>
  ) {}

  remove(pictureId: number) {
    return this.pictureRepository.delete({
      picture: { id: pictureId }
    })
  }
}
