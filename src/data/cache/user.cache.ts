import { nullable } from "@/share/fragment/pipe.function"
import { CacheStore, CACHE_MANAGER, Inject, Injectable } from "@nestjs/common"
import { deserialize, serialize } from "class-transformer"
import { Repository } from "typeorm"
import { InjectAccount } from "../decorator/inject-account.decorator"
import { UserEntity } from "../entity/account/user.entity"

const GET_KEY = "user:get:"

@Injectable()
export class UserCache {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore,
    @InjectAccount(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async get(id: number) {
    const json: string | undefined = await this.cacheManager.get(GET_KEY + id)
    if (json) {
      return deserialize(UserEntity, json)
    } else {
      const user = await this.userRepository
        .findOne({ id })
        .then(nullable("用户不存在"))
      await this.cacheManager.set(GET_KEY + user.id!, serialize(user), {
        ttl: 360
      })
      return user
    }
  }

  async save(user: UserEntity) {
    user = await this.userRepository.save(user)
    await this.cacheManager.set(GET_KEY + user.id!, serialize(user), {
      ttl: 360
    })
    return user
  }
}
