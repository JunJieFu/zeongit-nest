import { InjectBeauty } from "@/data/decorator/inject-beauty.decorator"
import { UserInfoEntity } from "@/data/entity/account/user-info.entity"
import { FollowEntity } from "@/data/entity/beauty/follow.entity"
import { Pageable } from "@/share/model/pageable.model"
import { addDay } from "@/share/uitl/date.util"
import { Injectable } from "@nestjs/common"
import { paginate } from "nestjs-typeorm-paginate"
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm"
import { FollowState } from "../constant/follow-state.constant"
import { PagingQuery } from "../query/follow.query"

@Injectable()
export class FollowService {
  constructor(
    @InjectBeauty(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>
  ) {}

  async getFollowState(followingId: number, followerId?: number) {
    if (followerId === undefined) {
      return FollowState.STRANGE
    }
    if (followerId === followingId) {
      return FollowState.SElF
    }
    return (await this.followRepository.count({
      followingId,
      createdBy: followerId
    }))
      ? FollowState.CONCERNED
      : FollowState.STRANGE
  }

  save(followingId: number, { id: followerId }: UserInfoEntity) {
    return this.followRepository.save(
      new FollowEntity(followerId!, followingId)
    )
  }

  remove(followingId: number, { id: followerId }: UserInfoEntity) {
    return this.followRepository.delete({ createdBy: followerId!, followingId })
  }

  pagingByFollowerId(pageable: Pageable, query: PagingQuery) {
    return paginate(
      this.followRepository,
      {
        page: pageable.page,
        limit: pageable.limit
      },
      {
        where: this.getQuery({
          createdBy: query.targetId,
          startDate: query.startDate,
          endDate: query.endDate
        }),
        order: Object.fromEntries(
          pageable.sort.map((it) => [it.key, it.order.toUpperCase()])
        )
      }
    )
  }

  pagingByFollowingId(pageable: Pageable, query: PagingQuery) {
    return paginate(
      this.followRepository,
      {
        page: pageable.page,
        limit: pageable.limit
      },
      {
        where: this.getQuery({
          followingId: query.targetId,
          startDate: query.startDate,
          endDate: query.endDate
        }),
        order: Object.fromEntries(
          pageable.sort.map((it) => [it.key, it.order.toUpperCase()])
        )
      }
    )
  }

  listByFollowerId(followerId: number) {
    return this.followRepository.find({ createdBy: followerId })
  }

  private getQuery(query: {
    createdBy?: number
    followingId?: number
    startDate?: Date
    endDate?: Date
  }) {
    const where = {} as Record<keyof FollowEntity, any>
    if (typeof query.createdBy !== "undefined") {
      where.createdBy = query.createdBy
    }
    if (typeof query.followingId !== "undefined") {
      where.followingId = query.followingId
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
