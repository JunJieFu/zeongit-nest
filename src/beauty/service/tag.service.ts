import { InjectBeauty } from "@/data/decorator/inject-beauty.decorator"
import { TagEntity } from "@/data/entity/beauty/tag.entity"
import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { PictureSuggestDocumentService } from "./picture-suggest-document.service"

@Injectable()
export class TagService {
  constructor(
    @InjectBeauty(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    private readonly pictureSuggestDocumentService: PictureSuggestDocumentService
  ) {}

  remove(pictureId: number) {
    return this.tagRepository.delete({
      picture: { id: pictureId }
    })
  }

  list() {
    return this.tagRepository.find()
  }

  async generateSuggest() {
    const list = Array.from(new Set((await this.list()).map((it) => it.name)))
    return this.pictureSuggestDocumentService.generateSuggest(list)
  }
}
