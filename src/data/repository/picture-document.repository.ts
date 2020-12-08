import { Injectable } from "@nestjs/common"
import { ElasticsearchService } from "@nestjs/elasticsearch"
import { Pageable } from "../../share/model/pageable.model"
import { Pagination } from "nestjs-typeorm-paginate"
import { fromPromise } from "rxjs/internal-compatibility"
import { map } from "rxjs/operators"
import { classToPlain, plainToClass } from "class-transformer"
import { PictureDocument } from "../document/beauty/picture.document"
import { nullable } from "../../share/fragment/pipe.function"
import { ZEONGIT_BEAUTY_PICTURE } from "../config"


@Injectable()
export class PictureDocumentRepository {
  constructor(private readonly elasticsearchService: ElasticsearchService) {
  }

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
    return fromPromise(this.elasticsearchService.get({
      id: id.toString(),
      index: ZEONGIT_BEAUTY_PICTURE
    })).pipe(map(it => plainToClass(PictureDocument, it.body._source as PictureDocument | undefined)), nullable("图片不存在")).toPromise()
  }

  paging(pageable: Pageable, query: unknown) {
    return fromPromise(this.elasticsearchService.search({
      index: ZEONGIT_BEAUTY_PICTURE,
      body: {
        size: pageable.limit,
        from: pageable.limit * (pageable.page - 1),
        query
      }
    })).pipe(map(it => {
      const hits = it.body.hits
      return new Pagination(
        plainToClass(PictureDocument, hits.hits.map((it: any) => it._source)),
        {
          itemCount: hits.hits.length as number,
          totalItems: hits.total,
          itemsPerPage: pageable.limit,
          totalPages: Math.ceil(hits.total / pageable.limit),
          currentPage: pageable.page
        })
    })).toPromise()
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
        size: pageable.page,
        sort: pageable.sort.map(it => ({ [it.key]: { order: it.order } })),
        from: pageable.limit * pageable.page,
        query,
        aggs
      }
    })
  }
}
