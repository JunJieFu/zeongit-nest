import { PictureSuggestDocument } from "@/data/document/beauty/picture-suggest.document"
import { PictureSuggestDocumentRepository } from "@/data/repository/picture-suggest-document.repository"
import { Injectable } from "@nestjs/common"

const PICTURE_SUGGEST_KEY = "picture_suggest"

@Injectable()
export class PictureSuggestDocumentService {
  constructor(
    private readonly pictureSuggestDocumentRepository: PictureSuggestDocumentRepository
  ) {}

  async search(keyword: string) {
    const source = await this.pictureSuggestDocumentRepository.suggest({
      [PICTURE_SUGGEST_KEY]: {
        prefix: keyword,
        completion: {
          field: "tag",
          skip_duplicates:true,
          size: 10
        }
      }
    })
    return (source.body.suggest[PICTURE_SUGGEST_KEY][0]?.options as
      | any[]
      | undefined)?.map((it) => it.text)
  }

  generateSuggest(tagList: string[]) {
    const list = tagList.map((it) => new PictureSuggestDocument(it))
    return this.pictureSuggestDocumentRepository.saveAll(list)
  }
}
