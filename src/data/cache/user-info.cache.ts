import { CACHE_MANAGER, CacheStore, Inject, Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { UserInfoEntity } from "../entity/account/user-info.entity"
import { deserialize, serialize } from "class-transformer"
import { fromPromise } from "rxjs/internal-compatibility"
import { mergeMap } from "rxjs/operators"
import { of } from "rxjs"
import { nullable } from "../../share/fragment/pipe.function"
import { InjectAccount } from "../decorator/inject-account.decorator"


const GET_KEY = "user_info:get:"

@Injectable()
export class UserInfoCache {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore,
              @InjectAccount(UserInfoEntity) private readonly userInfoRepository: Repository<UserInfoEntity>
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
      }), nullable("用户不存在")).toPromise()
  }

  async save(userInfo: UserInfoEntity) {
    await this.cacheManager.set(GET_KEY + userInfo.id!, serialize(await this.userInfoRepository.save(userInfo)), {
      ttl: 360
    })
    return userInfo
  }
}
