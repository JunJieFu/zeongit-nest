import { Injectable } from "@nestjs/common"
import { ElasticsearchService } from "@nestjs/elasticsearch"
import { classToPlain } from "class-transformer"
import { ZEONGIT_BEAUTY_PICTURE_SUGGEST } from "../config"
import { PictureSuggestDocument } from "../document/beauty/picture-suggest.document"

@Injectable()
export class PictureSuggestDocumentRepository {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  suggest(suggest: unknown) {
    return this.elasticsearchService.search({
      index: ZEONGIT_BEAUTY_PICTURE_SUGGEST,
      body: {
        suggest
      }
    })
  }

  async saveAll(pictureSuggestList: PictureSuggestDocument[]) {
    const list = []
    for (const pictureSuggest of pictureSuggestList) {
      try {
        list.push({
          index: {
            _index: ZEONGIT_BEAUTY_PICTURE_SUGGEST,
            _type: "_doc"
          }
        })
        list.push(classToPlain(pictureSuggest))
      } catch (e) {
        console.log(e)
      }
    }
    this.elasticsearchService.bulk({
      index: ZEONGIT_BEAUTY_PICTURE_SUGGEST,
      type: "_doc",
      body: list
    })
    return pictureSuggestList.length
  }
}
