import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { nullable } from "../../share/fragment/pipe.function"
import { InjectAccount } from "../../data/decorator/inject-account.decorator"

@Injectable()
export class UserInfoService {
  constructor(
    @InjectAccount(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>) {
  }

  get(id: number) {
    return this.userInfoRepository.findOne({ id }).then(nullable("用户不存在"))
  }

  save(userInfo: UserInfoEntity) {
    return this.userInfoRepository.save(userInfo)
  }
}
