import { CACHE_MANAGER, CacheStore, Inject, Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { UserEntity } from "../entity/account/user.entity"
import { deserialize, serialize } from "class-transformer"
import { fromPromise } from "rxjs/internal-compatibility"
import { mergeMap } from "rxjs/operators"
import { of } from "rxjs"
import { nullable } from "../../share/fragment/pipe.function"
import { InjectAccount } from "../decorator/inject-account.decorator"

const GET_KEY = "user:get:"

@Injectable()
export class UserCache {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore,
              @InjectAccount(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {
  }

  get(id: number) {
    return fromPromise(this.cacheManager.get(GET_KEY + id) as Promise<string | undefined>).pipe(
      mergeMap(json => {
        if (json) {
          return of(deserialize(UserEntity, json))
        } else {
          return fromPromise(this.userRepository.findOne({ id }))
        }
      }), nullable("用户不存在")).toPromise()
  }

  async save(user: UserEntity) {
    user = await this.userRepository.save(user)
    await this.cacheManager.set(GET_KEY + user.id!, serialize(user), {
      ttl: 360
    })
    return user
  }
}
