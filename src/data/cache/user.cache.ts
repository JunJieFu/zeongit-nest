import { CACHE_MANAGER, CacheStore, Inject, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UserEntity } from "../entity/account/user.entity"
import { deserialize, serialize } from "class-transformer"
import { fromPromise } from "rxjs/internal-compatibility"
import { map, mergeMap } from "rxjs/operators"
import { of } from "rxjs"
import { nullable } from "../../share/fragment/pipe.function"

const GET_KEY = "user:get:"

@Injectable()
export class UserCache {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore,
              @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
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
      }), nullable("用户不存在"))
  }

  save(user: UserEntity) {
    return fromPromise(this.cacheManager.set(GET_KEY + user.id!, serialize(user), {
      ttl: 360
    }) as Promise<void>).pipe(
      map(() => user))
  }
}
