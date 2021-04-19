import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { UserInfoCache } from "../../data/cache/user-info.cache"
import { InjectAccount } from "../../data/decorator/inject-account.decorator"

@Injectable()
export class UserInfoService {
  constructor(
    @InjectAccount(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>,
    private readonly userInfoCache: UserInfoCache
  ) {}

  save(userInfo: UserInfoEntity) {
    return this.userInfoCache.save(userInfo)
  }
}
