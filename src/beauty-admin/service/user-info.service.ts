import { UserInfoCache } from "@/data/cache/user-info.cache"
import { InjectAccount } from "@/data/decorator/inject-account.decorator"
import { UserInfoEntity } from "@/data/entity/account/user-info.entity"
import { nullable } from "@/share/fragment/pipe.function"
import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"

@Injectable()
export class UserInfoService {
  constructor(
    @InjectAccount(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>,
    private readonly userInfoCache: UserInfoCache
  ) {}

  get(id: number) {
    return this.userInfoRepository.findOne({ id }).then(nullable("用户不存在"))
  }

  getByUserId(userId: number) {
    return this.userInfoRepository
      .findOne({ userId })
      .then(nullable("用户不存在"))
  }

  save(userInfo: UserInfoEntity) {
    return this.userInfoCache.save(userInfo)
  }
}
