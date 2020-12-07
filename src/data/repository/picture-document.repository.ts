import { Injectable } from "@nestjs/common"
import { ElasticsearchService } from "@nestjs/elasticsearch"
import { AspectRatio } from "../constant/aspect-ratio.constant"
import { Pageable } from "../../share/model/pageable.model"
import { Pagination } from "nestjs-typeorm-paginate"
import { ZEONGIT_BEAUTY_PICTURE } from "../constant/document-index.constant"
import { fromPromise } from "rxjs/internal-compatibility"
import { map } from "rxjs/operators"
import { classToPlain, plainToClass } from "class-transformer"
import { PictureDocument } from "../document/beauty/picture.document"
import { nullable } from "../../share/fragment/pipe.function"
import { PrivacyState } from "../constant/privacy-state.constant"

interface Query {
  tagList: string[]
  precise: boolean
  name?: string
  startDate?: Date
  endDate?: Date
  aspectRatio?: AspectRatio
  privacy?: PrivacyState
  mustUserList: number[]
  userBlacklist: number[]
  pictureBlacklist: number[]
  tagBlacklist: string[]
}


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

  get(id: number) {
    return fromPromise(this.elasticsearchService.get({
      id: id.toString(),
      index: ZEONGIT_BEAUTY_PICTURE
    })).pipe(map(it => plainToClass(PictureDocument, it.body._source as PictureDocument | undefined)), nullable("图片不存在")).toPromise()
  }


  paging(pageable: Pageable, query: Query) {
    return fromPromise(this.elasticsearchService.search({
      index: ZEONGIT_BEAUTY_PICTURE,
      body: {
        size: pageable.page,
        from: pageable.limit * pageable.page,
        query: this.generateQuery(query)
      }
    })).pipe(map(it => {
      const hits = it.body.hit
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

  count(query: Query) {
    return this.elasticsearchService.count({
      index: ZEONGIT_BEAUTY_PICTURE,
      body: {
        query: this.generateQuery(query)
      }
    })
  }

  private generateQuery(
    {
      tagList = [],
      precise,
      name,
      startDate,
      endDate,
      aspectRatio,
      privacy,
      mustUserList = [],
      userBlacklist = [],
      pictureBlacklist = [],
      tagBlacklist = []
    }: Query
  ) {
    const query: { bool: { must: any[] } } = {
      bool: {
        must: tagList.map((it) => ({
          [precise ? "term" : "wildcard"]: {
            tagList: precise ? it : `*${it}*`
          }
        }))
      }
    }
    query.bool.must.push({
      [precise ? "term" : "match_phrase"]: {
        name
      }
    })
    query.bool.must.push({
      range: {
        createDate: {
          gte: startDate,
          lte: endDate
        }
      }
    })
    query.bool.must.push({
      term: {
        aspectRatio
      }
    })
    query.bool.must.push({
      term: {
        privacy
      }
    })

    query.bool.must.push({
      bool: {
        should: mustUserList.map(it => ({ createdBy: it }))
      }
    })

    query.bool.must.push({
      bool: {
        must_not: userBlacklist.map(it => ({ term: { createdBy: it } }))
      }
    })

    query.bool.must.push({
      bool: {
        must_not: userBlacklist.map(it => ({ term: { createdBy: it } }))
      }
    })

    query.bool.must.push({
      bool: {
        must_not: pictureBlacklist.map(it => ({ term: { id: it } }))
      }
    })

    query.bool.must.push({
      bool: {
        must_not: tagBlacklist.map(it => ({ term: { tagList: it } }))
      }
    })

    return query
  }
}
