import { FollowState } from "../constant/follow-state.constant"
import { Repository } from "typeorm"
import { FollowEntity } from "../../data/entity/beauty/follow.entity"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { Pageable } from "../../share/model/pageable.model"
import { paginate } from "nestjs-typeorm-paginate"
import { Injectable } from "@nestjs/common"
import { InjectBeauty } from "../../data/decorator/inject-beauty.decorator"


@Injectable()
export class FollowService {
  constructor(
    @InjectBeauty(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>
  ) {
  }

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
    })) ? FollowState.CONCERNED : FollowState.STRANGE
  }

  save(followingId: number, { id: followerId }: UserInfoEntity) {
    return this.followRepository.save(new FollowEntity(followerId!, followingId))
  }

  remove(followingId: number, { id: followerId }: UserInfoEntity) {
    return this.followRepository.remove({ createdBy: followerId!, followingId })
  }

  pagingByFollowerId(pageable: Pageable, followerId: number) {
    return paginate(
      this.followRepository, {
        page: pageable.page,
        limit: pageable.limit
      }, {
        createdBy: followerId,
        order: Object.fromEntries(pageable.sort.map(it => [it.key, it.order]))
      })
  }

  pagingByFollowingId(pageable: Pageable, followingId: number) {
    return paginate(
      this.followRepository, {
        page: pageable.page,
        limit: pageable.limit
      }, {
        followingId,
        order: Object.fromEntries(pageable.sort.map(it => [it.key, it.order]))
      })
  }

  listByFollowerId(followerId: number) {
    return this.followRepository.find({ createdBy: followerId })
  }
}
