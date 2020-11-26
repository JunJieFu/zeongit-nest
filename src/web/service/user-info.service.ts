import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { UserInfoEntity } from "../../data/entity/user-info.entity"
import { UserInfoCache } from "../../data/cache/user-info.cache"


@Injectable()
export class UserInfoService {
  constructor(
    @InjectRepository(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>,
    private readonly userInfoCache: UserInfoCache
  ) {
  }

  save(userInfo: UserInfoEntity) {
    return this.userInfoCache.save(userInfo)
  }
}
