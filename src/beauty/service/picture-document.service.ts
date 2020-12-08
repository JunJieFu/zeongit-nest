import { Injectable } from "@nestjs/common"
import { PictureDocumentRepository } from "../../data/repository/picture-document.repository"
import { nullable } from "../../share/fragment/pipe.function"
import { fromPromise } from "rxjs/internal-compatibility"
import { PictureDocument } from "../../data/document/beauty/picture.document"
import { AspectRatio } from "../../data/constant/aspect-ratio.constant"
import { Pageable, Sort } from "../../share/model/pageable.model"
import { PrivacyState } from "../../data/constant/privacy-state.constant"
import { PictureBlackHoleService } from "./picture-black-hole.service"
import { UserBlackHoleService } from "./user-black-hole.service"
import { TagBlackHoleService } from "./tag-black-hole.service"
import { CollectionService } from "./collection.service"
import { FollowService } from "./follow.service"
import { Pagination } from "nestjs-typeorm-paginate"
import { SortOrder } from "../../share/constant/sort-order.constant"

interface Query {
  userInfoId?: number
  tagList?: string[]
  precise?: boolean
  name?: string
  startDate?: Date
  endDate?: Date
  aspectRatio?: AspectRatio
  privacy?: PrivacyState
  mustUserList?: number[]
  userBlacklist?: number[]
  pictureBlacklist?: number[]
  tagBlacklist?: string[]
}

const TAG_LIST_AGGREGATIONS_KEY = "tag_list_count"

@Injectable()
export class PictureDocumentService {
  constructor(private readonly pictureDocumentRepository: PictureDocumentRepository,
              private readonly pictureBlackHoleService: PictureBlackHoleService,
              private readonly userBlackHoleService: UserBlackHoleService,
              private readonly tagBlackHoleService: TagBlackHoleService,
              private readonly collectionService: CollectionService,
              private readonly followService: FollowService
  ) {
  }

  paging(pageable: Pageable, {
    userInfoId,
    tagList = [],
    precise = false,
    name,
    startDate,
    endDate,
    aspectRatio,
    mustUserList = [],
    userBlacklist = [],
    pictureBlacklist = [],
    tagBlacklist = []
  }: Query) {
    let privacy: PrivacyState | undefined = PrivacyState.PUBLIC
    if (mustUserList.length && mustUserList.filter(it => it === userInfoId).length === mustUserList.length) {
      privacy = undefined
    }

    return this.pictureDocumentRepository.paging(pageable, this.generateQuery({
      tagList,
      precise,
      name,
      startDate,
      endDate,
      aspectRatio,
      privacy,
      mustUserList,
      userBlacklist,
      pictureBlacklist,
      tagBlacklist
    }))
  }

  async pagingByFollowing(pageable: Pageable, userInfoId: number, startDate?: Date, endDate?: Date) {
    const followingList = await this.followService.listByFollowerId(userInfoId)
    if (followingList.length) {
      return new Pagination([], {
        itemCount: 0,
        totalItems: 0,
        itemsPerPage: pageable.limit,
        totalPages: 0,
        currentPage: pageable.page
      })
    } else {
      const pictureBlacklist = await this.pictureBlackHoleService.listBlacklist(userInfoId)
      const tagBlacklist = await this.tagBlackHoleService.listBlacklist(userInfoId)
      return this.paging(pageable,
        {
          pictureBlacklist,
          tagBlacklist,
          startDate,
          endDate,
          precise: true,
          mustUserList: followingList.map(it => it.followingId)
        }
      )
    }
  }

  async pagingByRecommend(pageable: Pageable, userInfoId?: number, startDate?: Date, endDate?: Date) {
    const tagList: string[] = []
    const pictureBlacklist = await this.pictureBlackHoleService.listBlacklist(userInfoId)
    const userBlacklist = await this.userBlackHoleService.listBlacklist(userInfoId)
    const tagBlacklist = await this.tagBlackHoleService.listBlacklist(userInfoId)

    if (userInfoId != null) {
      const collectionList = await this.collectionService.paging(new Pageable({
        page: 1,
        size: 5
      }), { targetId: userInfoId })
      for (const collection of collectionList.items) {
        pictureBlacklist.push(collection.pictureId)
        try {
          tagList.push.apply(null, (await this.get(collection.pictureId)).tagList)
        } catch (e) {
        }
      }
    }

    return this.paging(pageable,
      { tagList, userBlacklist, pictureBlacklist, tagBlacklist, startDate, endDate, precise: true }
    )
  }

  async pagingByRecommendById(pageable: Pageable, id: number, userInfoId?: number, startDate?: Date, endDate?: Date) {
    let tagList: string[] = []
    try {
      tagList = (await this.get(id)).tagList
    } catch (e) {
    }
    const pictureBlacklist = await this.pictureBlackHoleService.listBlacklist(userInfoId)
    const userBlacklist = await this.userBlackHoleService.listBlacklist(userInfoId)
    const tagBlacklist = await this.tagBlackHoleService.listBlacklist(userInfoId)

    return this.paging(pageable,
      { tagList, userBlacklist, pictureBlacklist, tagBlacklist, startDate, endDate, precise: true }
    )
  }


  get(id: number) {
    return fromPromise(this.pictureDocumentRepository.get(id)).pipe(nullable("图片不存在")).toPromise()
  }

  async getFirstByTag(tag: string, userInfoId?: number) {
    const pictureBlacklist = await this.pictureBlackHoleService.listBlacklist(userInfoId)
    const userBlacklist = await this.userBlackHoleService.listBlacklist(userInfoId)

    return (await this.paging(new Pageable({ page: 1, size: 1, sort: [new Sort("likeAmount", SortOrder.DESC)] }),
      {
        tagList: [tag],
        precise: true,
        pictureBlacklist,
        userBlacklist
      }
    )).items[0]
  }

  countByTag(tag: string) {
    return this.pictureDocumentRepository.count(this.generateQuery({
      tagList: [tag],
      precise: true,
      mustUserList: [],
      userBlacklist: [],
      pictureBlacklist: [],
      tagBlacklist: []
    }))
  }

  save(picture: PictureDocument) {
    return this.pictureDocumentRepository.save(picture)
  }

  saveLikeAmount(picture: PictureDocument, count: number) {
    picture.likeAmount = count
    return this.pictureDocumentRepository.save(picture)
  }

  saveViewAmount(picture: PictureDocument, count: number) {
    picture.viewAmount = count
    return this.pictureDocumentRepository.save(picture)
  }

  remove(id: number) {
    return this.pictureDocumentRepository.remove(id)
  }

  async listTagTop30(userInfoId?: number) {
    const tagBlacklist = await this.tagBlackHoleService.listBlacklist(userInfoId)
    const query = this.generateQuery({ tagBlacklist })
    return this.pictureDocumentRepository.aggregations(new Pageable({
      page: 1,
      size: 30,
      sort: [new Sort("likeAmount", SortOrder.DESC)]
    }), query, {
      [TAG_LIST_AGGREGATIONS_KEY]: {
        terms: {
          field: "tagList"
        }
      }
    }).then(it => it.body.aggregations[TAG_LIST_AGGREGATIONS_KEY].buckets as { key: string, doc_count: number }[])
  }

  async listTagByUserId(userInfoId: number) {
    const tagBlacklist = await this.tagBlackHoleService.listBlacklist(userInfoId)
    const query = this.generateQuery({ tagBlacklist, mustUserList: [userInfoId] })

    return this.pictureDocumentRepository.aggregations(new Pageable({
      page: 1,
      size: 30,
      sort: [new Sort("likeAmount", SortOrder.DESC)]
    }), query, {
      [TAG_LIST_AGGREGATIONS_KEY]: {
        terms: {
          field: "tagList"
        }
      }
    }).then(it => it.body.aggregations[TAG_LIST_AGGREGATIONS_KEY].buckets as { key: string, doc_count: number }[])
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
    if (name) {
      query.bool.must.push({
        [precise ? "term" : "match_phrase"]: {
          name
        }
      })
    }
    //TODO 开始结束天
    query.bool.must.push({
      range: {
        createDate: {
          gte: startDate,
          lte: endDate
        }
      }
    })
    if (aspectRatio) {
      query.bool.must.push({
        term: {
          aspectRatio
        }
      })
    }
    if (privacy) {
      query.bool.must.push({
        term: {
          privacy
        }
      })
    }

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
