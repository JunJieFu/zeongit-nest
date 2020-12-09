import { Injectable } from "@nestjs/common"
import { CollectState } from "../../data/constant/collect-state.constant"
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm"
import { CollectionEntity } from "../../data/entity/beauty/collection.entity"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { Pageable } from "../../share/model/pageable.model"
import { PagingQuery } from "../query/collection.query"
import { paginate } from "nestjs-typeorm-paginate"
import { InjectBeauty } from "../../data/decorator/inject-beauty.decorator"
import { FootprintEntity } from "../../data/entity/beauty/footprint.entity"


@Injectable()
export class CollectionService {

  constructor(
    @InjectBeauty(CollectionEntity)
    private readonly collectionRepository: Repository<CollectionEntity>
  ) {
  }

  async getCollectState(pictureId: number, userInfoId?: number) {
    if (userInfoId) {
      return (await this.collectionRepository.count({
        pictureId,
        createdBy: userInfoId
      })) ? CollectState.CONCERNED : CollectState.STRANGE
    } else {
      return CollectState.STRANGE
    }
  }

  remove(pictureId: number, { id: userInfoId }: UserInfoEntity) {
    return this.collectionRepository.remove({
      createdBy: userInfoId,
      pictureId
    })
  }

  save(pictureId: number, { id: userInfoId }: UserInfoEntity) {
    return this.collectionRepository.save(new CollectionEntity(userInfoId!, pictureId))
  }

  countByPictureId(pictureId: number) {
    return this.collectionRepository.count({ pictureId })
  }

  paging(pageable: Pageable, query: PagingQuery) {
    return paginate(
      this.collectionRepository, {
        page: pageable.page,
        limit: pageable.limit
      }, {
        where: this.getQuery(query),
        order: Object.fromEntries(pageable.sort.map(it => [it.key, it.order]))
      })
  }

  private getQuery(query: PagingQuery) {
    const where = {} as Record<keyof FootprintEntity, any>
    where.createdBy = query.targetId
    if (typeof query.pictureId !== "undefined") {
      where.pictureId = query.pictureId
    }
    if (typeof query.startDate !== "undefined" && typeof query.endDate !== "undefined") {
      where.createDate = Between(query.startDate, query.endDate)
    } else {
      if (typeof query.startDate !== "undefined") {
        where.createDate = MoreThanOrEqual(query.startDate)
      }
      if (typeof query.endDate !== "undefined") {
        where.createDate = LessThanOrEqual(query.endDate)
      }
    }
    return where
  }
}
