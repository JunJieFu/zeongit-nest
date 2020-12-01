import { FollowState } from "../constant/follow-state.constant"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FollowEntity } from "../../data/entity/beauty/follow.entity"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { Pageable } from "../../share/model/pageable.model"
import { paginate } from "nestjs-typeorm-paginate"
import { Injectable } from "@nestjs/common"


@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(FollowEntity)
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

  save(follower: UserInfoEntity, followingId: number) {
    return this.followRepository.save(new FollowEntity(follower.id!, followingId))
  }

  del(follower: UserInfoEntity, followingId: number) {
    return this.followRepository.remove({ createdBy: follower.id!, followingId })
  }

  pagingByFollowerId(pageable: Pageable, followerId: number) {
    return paginate(
      this.followRepository, {
        page: pageable.page,
        limit: pageable.limit
      }, {
        createdBy: followerId
      })
  }

  pagingByFollowingId(pageable: Pageable, followingId: number) {
    return paginate(
      this.followRepository, {
        page: pageable.page,
        limit: pageable.limit
      }, {
        followingId
      })
  }

  listByFollowerId(followerId: number) {
    return this.followRepository.find({ createdBy: followerId })
  }
}
