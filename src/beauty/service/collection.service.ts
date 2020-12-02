import { Injectable } from "@nestjs/common"
import { CollectState } from "../../data/constant/collect-state.constant"
import { InjectRepository } from "@nestjs/typeorm"
import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm"
import { CollectionEntity } from "../../data/entity/beauty/collection.entity"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { Pageable } from "../../share/model/pageable.model"
import { PagingQuery } from "../query/collection.query"
import { paginate } from "nestjs-typeorm-paginate"


@Injectable()
export class CollectionService {

  constructor(
    @InjectRepository(CollectionEntity)
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
        where: CollectionService.getQuery(query)
      })
  }

  private static getQuery(query: PagingQuery) {
    const where: Record<string, any> = {}
    where.createdBy = query.targetId
    if (query.startDate) {
      where.createDate = MoreThanOrEqual(query.startDate)
    }
    if (query.endDate) {
      where.createDate = LessThanOrEqual(query.endDate)
    }
    return where
  }
}
