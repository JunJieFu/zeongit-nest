import { Injectable } from "@nestjs/common"
import { ElasticsearchService } from "@nestjs/elasticsearch"
import { Pageable } from "../../share/model/pageable.model"
import { Pagination } from "nestjs-typeorm-paginate"
import { classToPlain, plainToClass } from "class-transformer"
import { nullable } from "../../share/fragment/pipe.function"
import { ZEONGIT_BEAUTY_USER_INFO } from "../config"
import { UserInfoDocument } from "../document/beauty/user-info.document"
import { UserInfoEntity } from "../entity/account/user-info.entity"

@Injectable()
export class UserInfoDocumentRepository {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async save(userInfoDocument: UserInfoDocument) {
    await this.elasticsearchService.index({
      id: userInfoDocument.id.toString(),
      index: ZEONGIT_BEAUTY_USER_INFO,
      type: "_doc",
      body: classToPlain(userInfoDocument)
    })
    return this.get(userInfoDocument.id)
  }

  async get(id: number) {
    return this.elasticsearchService
      .get({
        id: id.toString(),
        index: ZEONGIT_BEAUTY_USER_INFO
      })
      .then((it) =>
        plainToClass(
          UserInfoDocument,
          it.body._source as UserInfoDocument | undefined
        )
      )
      .then(nullable("用户不存在"))
  }

  async paging(pageable: Pageable, query: unknown) {
    const response = await this.elasticsearchService.search({
      index: ZEONGIT_BEAUTY_USER_INFO,
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
        UserInfoDocument,
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
      index: ZEONGIT_BEAUTY_USER_INFO,
      body: {
        query
      }
    })
  }

  remove(id: number) {
    return this.elasticsearchService.delete({
      index: ZEONGIT_BEAUTY_USER_INFO,
      type: "_doc",
      id: id.toString()
    })
  }

  aggregations(pageable: Pageable, query: unknown, aggs: unknown) {
    return this.elasticsearchService.search({
      index: ZEONGIT_BEAUTY_USER_INFO,
      body: {
        sort: pageable.sort.map((it) => ({ [it.key]: { order: it.order } })),
        query,
        aggs
      }
    })
  }

  async synchronizationIndexUserInfo(userInfoList: UserInfoEntity[]) {
    const list = []
    for (const userInfo of userInfoList) {
      try {
        const userInfoDocument = new UserInfoDocument(userInfo)
        list.push({
          index: {
            _index: ZEONGIT_BEAUTY_USER_INFO,
            _type: "_doc",
            _id: userInfoDocument.id.toString()
          }
        })
        list.push(classToPlain(userInfoDocument))
      } catch (e) {
        console.error(e)
      }
    }
    this.elasticsearchService.bulk({
      index: ZEONGIT_BEAUTY_USER_INFO,
      type: "_doc",
      body: list
    })
    return userInfoList.length
  }
}
