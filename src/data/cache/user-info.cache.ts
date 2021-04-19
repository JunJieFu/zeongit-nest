import { CACHE_MANAGER, CacheStore, Inject, Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { UserInfoEntity } from "../entity/account/user-info.entity"
import { deserialize, serialize } from "class-transformer"
import { nullable } from "../../share/fragment/pipe.function"
import { InjectAccount } from "../decorator/inject-account.decorator"
import { UserInfoDocumentRepository } from "../repository/user-info-document.repository"
import { UserInfoDocument } from "../document/beauty/user-info.document"

const GET_KEY = "user_info:get:"

@Injectable()
export class UserInfoCache {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore,
    @InjectAccount(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>,
    private readonly userInfoDocumentRepository: UserInfoDocumentRepository
  ) {}

  async get(id: number) {
    const json: string | undefined = await this.cacheManager.get(GET_KEY + id)
    if (json) {
      return deserialize(UserInfoEntity, json)
    } else {
      const userInfo = await this.userInfoRepository
        .findOne({ id })
        .then(nullable("用户不存在"))
      await this.cacheManager.set(GET_KEY + userInfo.id!, serialize(userInfo), {
        ttl: 360
      })
      return userInfo
    }
  }

  async save(userInfo: UserInfoEntity) {
    userInfo = await this.userInfoRepository.save(userInfo)
    await this.cacheManager.set(GET_KEY + userInfo.id!, serialize(userInfo), {
      ttl: 360
    })
    await this.userInfoDocumentRepository.save(new UserInfoDocument(userInfo))
    return userInfo
  }
}
