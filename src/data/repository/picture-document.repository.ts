import { nullable } from "@/share/fragment/pipe.function"
import { Pageable } from "@/share/model/pageable.model"
import { Injectable } from "@nestjs/common"
import { ElasticsearchService } from "@nestjs/elasticsearch"
import { classToPlain, plainToClass } from "class-transformer"
import { Pagination } from "nestjs-typeorm-paginate"
import { ZEONGIT_BEAUTY_PICTURE } from "../config"
import { PictureDocument } from "../document/beauty/picture.document"
import { PictureEntity } from "../entity/beauty/picture.entity"

@Injectable()
export class PictureDocumentRepository {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async save(pictureDocument: PictureDocument) {
    await this.elasticsearchService.index({
      id: pictureDocument.id.toString(),
      index: ZEONGIT_BEAUTY_PICTURE,
      type: "_doc",
      body: classToPlain(pictureDocument)
    })
    return this.get(pictureDocument.id)
  }

  async get(id: number) {
    return this.elasticsearchService
      .get({
        id: id.toString(),
        index: ZEONGIT_BEAUTY_PICTURE
      })
      .then((it) =>
        plainToClass(
          PictureDocument,
          it.body._source as PictureDocument | undefined
        )
      )
      .then(nullable("图片不存在"))
  }

  async paging(pageable: Pageable, query: unknown) {
    const response = await this.elasticsearchService.search({
      index: ZEONGIT_BEAUTY_PICTURE,
      body: {
        size: pageable.limit,
        from: pageable.limit * (pageable.page - 1),
        sort: pageable.sort.map((it) => ({ [it.key]: { order: it.order } })),
        query
      }
    })
    const hits = response.body.hits
    return new Pagination(
      plainToClass(
        PictureDocument,
        hits.hits.map((it: any) => it._source)
      ),
      {
        itemCount: hits.hits.length as number,
        totalItems: hits.total,
        itemsPerPage: pageable.limit,
        totalPages: Math.ceil(hits.total / pageable.limit),
        currentPage: pageable.page
      }
    )
  }

  count(query: unknown) {
    return this.elasticsearchService.count({
      index: ZEONGIT_BEAUTY_PICTURE,
      body: {
        query
      }
    })
  }

  remove(id: number) {
    return this.elasticsearchService.delete({
      index: ZEONGIT_BEAUTY_PICTURE,
      type: "_doc",
      id: id.toString()
    })
  }

  aggregations(pageable: Pageable, query: unknown, aggs: unknown) {
    return this.elasticsearchService.search({
      index: ZEONGIT_BEAUTY_PICTURE,
      body: {
        sort: pageable.sort.map((it) => ({ [it.key]: { order: it.order } })),
        query,
        aggs
      }
    })
  }

  async synchronizationIndex(pictureList: PictureEntity[]) {
    const list = []
    for (const picture of pictureList) {
      try {
        const pictureDocument = new PictureDocument(picture)
        list.push({
          index: {
            _index: ZEONGIT_BEAUTY_PICTURE,
            _type: "_doc",
            _id: pictureDocument.id.toString()
          }
        })
        list.push(classToPlain(pictureDocument))
      } catch (e) {
        console.log(e)
      }
    }
    this.elasticsearchService.bulk({
      index: ZEONGIT_BEAUTY_PICTURE,
      type: "_doc",
      body: list
    })
    return pictureList.length
  }
}
