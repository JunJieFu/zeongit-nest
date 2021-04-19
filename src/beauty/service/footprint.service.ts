import { Injectable } from "@nestjs/common"
import { CollectState } from "../../data/constant/collect-state.constant"
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm"
import { FootprintEntity } from "../../data/entity/beauty/footprint.entity"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { Pageable } from "../../share/model/pageable.model"
import { PagingQuery } from "../query/footprint.query"
import { paginate } from "nestjs-typeorm-paginate"
import { nullable } from "../../share/fragment/pipe.function"
import { InjectBeauty } from "../../data/decorator/inject-beauty.decorator"
import { addDay } from "../../share/uitl/date.util"

@Injectable()
export class FootprintService {
  constructor(
    @InjectBeauty(FootprintEntity)
    private readonly footprintRepository: Repository<FootprintEntity>
  ) {}

  async getCollectState(pictureId: number, userInfoId?: number) {
    if (userInfoId) {
      return (await this.footprintRepository.count({
        pictureId,
        createdBy: userInfoId
      }))
        ? CollectState.CONCERNED
        : CollectState.STRANGE
    } else {
      return CollectState.STRANGE
    }
  }

  remove(pictureId: number, { id: userInfoId }: UserInfoEntity) {
    return this.footprintRepository.delete({
      createdBy: userInfoId,
      pictureId
    })
  }

  get(pictureId: number, { id: userInfoId }: UserInfoEntity) {
    return this.footprintRepository
      .findOne({
        pictureId,
        createdBy: userInfoId
      })
      .then(nullable("足迹不存在"))
  }

  async update(pictureId: number, userInfo: UserInfoEntity) {
    const footprint = await this.get(pictureId, userInfo)
    footprint.updateDate = new Date()
    return this.footprintRepository.save(footprint)
  }

  save(pictureId: number, { id: userInfoId }: UserInfoEntity) {
    return this.footprintRepository.save(
      new FootprintEntity(userInfoId!, pictureId)
    )
  }

  countByPictureId(pictureId: number) {
    return this.footprintRepository.count({ pictureId })
  }

  async paging(pageable: Pageable, query: PagingQuery) {
    return paginate(
      this.footprintRepository,
      {
        page: pageable.page,
        limit: pageable.limit
      },
      {
        where: this.getQuery(query),
        order: Object.fromEntries(
          pageable.sort.map((it) => [it.key, it.order.toUpperCase()])
        )
      }
    )
  }

  private getQuery(query: PagingQuery) {
    const where = {} as Record<keyof FootprintEntity, any>
    if (typeof query.targetId !== "undefined") {
      where.createdBy = query.targetId
    }
    if (typeof query.pictureId !== "undefined") {
      where.pictureId = query.pictureId
    }
    if (
      typeof query.startDate !== "undefined" &&
      typeof query.endDate !== "undefined"
    ) {
      where.createDate = Between(query.startDate, addDay(query.endDate, 1))
    } else {
      if (typeof query.startDate !== "undefined") {
        where.createDate = MoreThanOrEqual(query.startDate)
      }
      if (typeof query.endDate !== "undefined") {
        where.createDate = LessThanOrEqual(addDay(query.endDate, 1))
      }
    }
    return where
  }
}
