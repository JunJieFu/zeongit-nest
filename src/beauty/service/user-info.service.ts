import { Repository } from "typeorm"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { fromPromise } from "rxjs/internal-compatibility"
import { nullable } from "../../share/fragment/pipe.function"

export class UserInfoService {
  constructor(private readonly userInfoRepository: Repository<UserInfoEntity>) {
  }

  get(id: number) {
    return fromPromise(this.userInfoRepository.findOne({ id })).pipe(nullable("用户不存在"))
  }
}
