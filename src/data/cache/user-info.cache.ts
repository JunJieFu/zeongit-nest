import { CACHE_MANAGER, CacheStore, Inject, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UserInfoEntity } from "../entity/user-info.entity"
import { deserialize, serialize } from "class-transformer"
import { fromPromise } from "rxjs/internal-compatibility"
import { map, mergeMap } from "rxjs/operators"
import { of } from "rxjs"
import { nullable } from "../../share/fragment/pipe.function"


const GET_KEY = "user_info:get:"

@Injectable()
export class UserInfoCache {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore,
              @InjectRepository(UserInfoEntity) private readonly userInfoRepository: Repository<UserInfoEntity>
  ) {
  }

  get(id: number) {
    return fromPromise(this.cacheManager.get(GET_KEY + id) as Promise<string | undefined>).pipe(
      mergeMap(json => {
        if (json) {
          return of(deserialize(UserInfoEntity, json))
        } else {
          return fromPromise(this.userInfoRepository.findOne({ id }))
        }
      }), map(nullable("用户不存在"))
    )
  }

  save(userInfo: UserInfoEntity) {
    return fromPromise(this.cacheManager.set(GET_KEY + userInfo.id!, serialize(userInfo)) as Promise<void>).pipe(
      map(() => userInfo))
  }
}
