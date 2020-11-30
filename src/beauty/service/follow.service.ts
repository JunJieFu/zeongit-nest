import { FollowState } from "../constant/follow-state.constant"
import { of } from "rxjs"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FollowEntity } from "../../data/entity/beauty/follow.entity"
import { fromPromise } from "rxjs/internal-compatibility"
import { catchError, map } from "rxjs/operators"
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

  getFollowState(followingId: number, followerId?: number) {
    if (followerId === undefined) {
      return of(FollowState.STRANGE)
    }
    if (followerId === followingId) {
      return of(FollowState.SElF)
    }
    return fromPromise(this.followRepository.count({
      followingId,
      createdBy: followerId
    })).pipe(
      catchError(() => of(FollowState.SElF)),
      map(it => it ? FollowState.CONCERNED : FollowState.STRANGE)
    )
  }

  save(follower: UserInfoEntity, followingId: number) {
    return this.followRepository.save(new FollowEntity(follower.id!, followingId))
  }

  del(follower: UserInfoEntity, followingId: number) {
    return fromPromise(this.followRepository.remove({ createdBy: follower.id!, followingId }))
  }

  pagingByFollowerId(pageable: Pageable, followerId: number) {
    return fromPromise(paginate(
      this.followRepository, {
        page: pageable.page,
        limit: pageable.limit
      }, {
        createdBy: followerId
      }))
  }

  pagingByFollowingId(pageable: Pageable, followingId: number) {
    return fromPromise(paginate(
      this.followRepository, {
        page: pageable.page,
        limit: pageable.limit
      }, {
        followingId
      }))
  }

  listByFollowerId(followerId: number) {
    return this.followRepository.find({ createdBy: followerId })
  }
}
