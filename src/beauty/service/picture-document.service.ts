import { AspectRatio } from "@/data/constant/aspect-ratio.constant"
import { PrivacyState } from "@/data/constant/privacy-state.constant"
import { PictureDocument } from "@/data/document/beauty/picture.document"
import { PictureEntity } from "@/data/entity/beauty/picture.entity"
import { PictureDocumentRepository } from "@/data/repository/picture-document.repository"
import { SortOrder } from "@/share/constant/sort-order.constant"
import { nullable } from "@/share/fragment/pipe.function"
import { Pageable, Sort } from "@/share/model/pageable.model"
import { addDay } from "@/share/uitl/date.util"
import { Injectable } from "@nestjs/common"
import { Pagination } from "nestjs-typeorm-paginate"
import { CollectionService } from "./collection.service"
import { FollowService } from "./follow.service"
import { PictureBlackHoleService } from "./picture-black-hole.service"
import { TagBlackHoleService } from "./tag-black-hole.service"
import { UserBlackHoleService } from "./user-black-hole.service"

interface Query {
  userInfoId?: number
  tagList?: string[]
  precise?: boolean
  and?: boolean
  name?: string
  startDate?: Date
  endDate?: Date
  aspectRatio?: AspectRatio[]
  startWidth?: number
  endWidth?: number
  startHeight?: number
  endHeight?: number
  startRatio?: number
  endRatio?: number
  privacy?: PrivacyState
  mustUserList?: number[]
  userBlacklist?: number[]
  pictureBlacklist?: number[]
  tagBlacklist?: string[]
}

const TAG_LIST_AGGREGATIONS_KEY = "tag_list_count"

@Injectable()
export class PictureDocumentService {
  constructor(
    private readonly pictureDocumentRepository: PictureDocumentRepository,
    private readonly pictureBlackHoleService: PictureBlackHoleService,
    private readonly userBlackHoleService: UserBlackHoleService,
    private readonly tagBlackHoleService: TagBlackHoleService,
    private readonly collectionService: CollectionService,
    private readonly followService: FollowService
  ) {}

  paging(
    pageable: Pageable,
    {
      userInfoId,
      tagList = [],
      precise = false,
      name,
      startDate,
      endDate,
      aspectRatio = [],
      startWidth,
      endWidth,
      startHeight,
      endHeight,
      startRatio,
      endRatio,
      mustUserList = [],
      userBlacklist = [],
      pictureBlacklist = [],
      tagBlacklist = []
    }: Query
  ) {
    let privacy: PrivacyState | undefined = PrivacyState.PUBLIC
    if (
      mustUserList.length &&
      mustUserList.filter((it) => it === userInfoId).length ===
        mustUserList.length
    ) {
      privacy = undefined
    }
    return this.pictureDocumentRepository.paging(
      pageable,
      this.generateQuery({
        tagList,
        precise,
        name,
        startDate,
        endDate,
        aspectRatio,
        startWidth,
        endWidth,
        startHeight,
        endHeight,
        startRatio,
        endRatio,
        privacy,
        mustUserList,
        userBlacklist,
        pictureBlacklist,
        tagBlacklist
      })
    )
  }

  async pagingByFollowing(
    pageable: Pageable,
    userInfoId: number,
    startDate?: Date,
    endDate?: Date
  ) {
    const followingList = await this.followService.listByFollowerId(userInfoId)
    if (followingList.length) {
      const pictureBlacklist = await this.pictureBlackHoleService.listBlacklist(
        userInfoId
      )
      const tagBlacklist = await this.tagBlackHoleService.listBlacklist(
        userInfoId
      )
      return this.paging(pageable, {
        pictureBlacklist,
        tagBlacklist,
        startDate,
        endDate,
        precise: true,
        mustUserList: followingList.map((it) => it.followingId)
      })
    } else {
      return new Pagination([], {
        itemCount: 0,
        totalItems: 0,
        itemsPerPage: pageable.limit,
        totalPages: 0,
        currentPage: pageable.page
      })
    }
  }

  async pagingByRecommend(
    pageable: Pageable,
    userInfoId?: number,
    startDate?: Date,
    endDate?: Date
  ) {
    const tagList: string[] = []
    const pictureBlacklist = await this.pictureBlackHoleService.listBlacklist(
      userInfoId
    )
    const userBlacklist = await this.userBlackHoleService.listBlacklist(
      userInfoId
    )
    const tagBlacklist = await this.tagBlackHoleService.listBlacklist(
      userInfoId
    )

    if (userInfoId != null) {
      const collectionList = await this.collectionService.paging(
        new Pageable({
          page: 1,
          limit: 5
        }),
        { targetId: userInfoId }
      )
      for (const collection of collectionList.items) {
        pictureBlacklist.push(collection.pictureId)
        try {
          tagList.push(...(await this.get(collection.pictureId)).tagList)
        } catch (e) {}
      }
    }
    return this.paging(pageable, {
      tagList,
      userBlacklist,
      pictureBlacklist,
      tagBlacklist,
      startDate,
      endDate
    })
  }

  async pagingByRecommendById(
    pageable: Pageable,
    id: number,
    userInfoId?: number,
    startDate?: Date,
    endDate?: Date
  ) {
    let tagList: string[] = []
    try {
      tagList = (await this.get(id)).tagList
    } catch (e) {}
    const pictureBlacklist = await this.pictureBlackHoleService.listBlacklist(
      userInfoId
    )
    const userBlacklist = await this.userBlackHoleService.listBlacklist(
      userInfoId
    )
    const tagBlacklist = await this.tagBlackHoleService.listBlacklist(
      userInfoId
    )

    return this.paging(pageable, {
      tagList,
      userBlacklist,
      pictureBlacklist,
      tagBlacklist,
      startDate,
      endDate,
      precise: true
    })
  }

  get(id: number) {
    return this.pictureDocumentRepository.get(id).then(nullable("图片不存在"))
  }

  async getFirstByTag(tag: string, userInfoId?: number) {
    const pictureBlacklist = await this.pictureBlackHoleService.listBlacklist(
      userInfoId
    )
    const userBlacklist = await this.userBlackHoleService.listBlacklist(
      userInfoId
    )

    return (
      await this.paging(
        new Pageable({
          page: 1,
          limit: 1,
          sort: [new Sort("likeAmount", SortOrder.DESC)]
        }),
        {
          tagList: [tag],
          precise: true,
          pictureBlacklist,
          userBlacklist
        }
      )
    ).items[0]
  }

  countByTag(tag: string) {
    return this.pictureDocumentRepository.count(
      this.generateQuery({
        tagList: [tag],
        precise: true,
        mustUserList: [],
        userBlacklist: [],
        pictureBlacklist: [],
        tagBlacklist: []
      })
    )
  }

  save(picture: PictureDocument) {
    return this.pictureDocumentRepository.save(picture)
  }

  saveLikeAmount(picture: PictureDocument, count: number) {
    picture.likeAmount = count
    return this.save(picture)
  }

  saveViewAmount(picture: PictureDocument, count: number) {
    picture.viewAmount = count
    return this.save(picture)
  }

  remove(id: number) {
    return this.pictureDocumentRepository.remove(id)
  }

  async listTagTop30(userInfoId?: number) {
    const tagBlacklist = await this.tagBlackHoleService.listBlacklist(
      userInfoId
    )
    const query = this.generateQuery({ tagBlacklist })
    return this.pictureDocumentRepository
      .aggregations(
        new Pageable({
          page: 1,
          limit: 30,
          sort: [new Sort("likeAmount", SortOrder.DESC)]
        }),
        query,
        {
          [TAG_LIST_AGGREGATIONS_KEY]: {
            terms: {
              field: "tagList",
              size: 30
            }
          }
        }
      )
      .then(
        (it) =>
          it.body.aggregations[TAG_LIST_AGGREGATIONS_KEY].buckets as {
            key: string
            doc_count: number
          }[]
      )
      .then((it) => it.filter((item) => item.key !== ""))
  }

  async listTagByUserId(userInfoId: number) {
    const tagBlacklist = await this.tagBlackHoleService.listBlacklist(
      userInfoId
    )
    const query = this.generateQuery({
      tagBlacklist,
      mustUserList: [userInfoId]
    })

    return this.pictureDocumentRepository
      .aggregations(
        new Pageable({
          page: 1,
          limit: 30,
          sort: [new Sort("likeAmount", SortOrder.DESC)]
        }),
        query,
        {
          [TAG_LIST_AGGREGATIONS_KEY]: {
            terms: {
              field: "tagList",
              size: 30
            }
          }
        }
      )
      .then(
        (it) =>
          it.body.aggregations[TAG_LIST_AGGREGATIONS_KEY].buckets as {
            key: string
            doc_count: number
          }[]
      )
      .then((it) => it.filter((item) => item.key !== ""))
  }

  private generateQuery({
    tagList = [],
    precise,
    and,
    name,
    startDate,
    endDate,
    aspectRatio,
    startWidth,
    endWidth,
    startHeight,
    endHeight,
    startRatio,
    endRatio,
    privacy,
    mustUserList = [],
    userBlacklist = [],
    pictureBlacklist = [],
    tagBlacklist = []
  }: Query) {
    const query: any = {
      bool: {
        must: [],
        should: []
      }
    }
    query.bool[and ? "must" : "should"].push(
      ...tagList.map((it) => ({
        [precise ? "term" : "wildcard"]: {
          tagList: precise ? it : `*${it}*`
        }
      }))
    )

    if (tagList && tagList.length) {
      query.bool.minimum_should_match = tagList.length < 3 ? tagList.length : 3
    }

    if (name) {
      query.bool.must.push({
        [precise ? "term" : "match_phrase"]: {
          name
        }
      })
    }
    query.bool.must.push({
      range: {
        createDate: {
          gte: startDate,
          lte: endDate ? addDay(endDate, 1) : undefined
        }
      }
    })
    query.bool.must.push({
      range: {
        width: {
          gte: startWidth,
          lte: endWidth
        }
      }
    })
    query.bool.must.push({
      range: {
        height: {
          gte: startHeight,
          lte: endHeight
        }
      }
    })
    query.bool.must.push({
      range: {
        ratio: {
          gte: startRatio,
          lte: endRatio
        }
      }
    })
    if (typeof aspectRatio !== "undefined") {
      query.bool.must.push({
        bool: {
          should: aspectRatio.map((it) => ({ term: { aspectRatio: it } })),
          minimum_should_match: 1
        }
      })
    }
    if (typeof privacy !== "undefined") {
      query.bool.must.push({
        term: {
          privacy
        }
      })
    }

    query.bool.must.push({
      bool: {
        should: mustUserList.map((it) => ({ term: { createdBy: it } })),
        minimum_should_match: 1
      }
    })

    query.bool.must.push({
      bool: {
        must_not: userBlacklist.map((it) => ({ term: { createdBy: it } }))
      }
    })

    query.bool.must.push({
      bool: {
        must_not: userBlacklist.map((it) => ({ term: { createdBy: it } }))
      }
    })

    query.bool.must.push({
      bool: {
        must_not: pictureBlacklist.map((it) => ({ term: { id: it } }))
      }
    })

    query.bool.must.push({
      bool: {
        must_not: tagBlacklist.map((it) => ({ term: { tagList: it } }))
      }
    })
    return query
  }

  synchronizationIndex(pictureList: PictureEntity[]) {
    return this.pictureDocumentRepository.synchronizationIndex(
      pictureList
    )
  }
}
