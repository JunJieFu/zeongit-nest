import { Repository } from "typeorm"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { fromPromise } from "rxjs/internal-compatibility"
import { nullable } from "../../share/fragment/pipe.function"
import { InjectAccount } from "../../data/decorator/inject-account.decorator"

export class UserInfoService {
  constructor(@InjectAccount(UserInfoEntity) private readonly userInfoRepository: Repository<UserInfoEntity>) {
  }

  get(id: number) {
    return fromPromise(this.userInfoRepository.findOne({ id })).pipe(nullable("用户不存在")).toPromise()
  }
}
