import { Repository } from "typeorm"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { nullable } from "../../share/fragment/pipe.function"
import { InjectAccount } from "../../data/decorator/inject-account.decorator"
import { UserInfoDocumentRepository } from "../../data/repository/user-info-document.repository";

export class UserInfoService {
  constructor(@InjectAccount(UserInfoEntity) private readonly userInfoRepository: Repository<UserInfoEntity>,
              private readonly userInfoDocumentRepository:UserInfoDocumentRepository
              ) {
  }

  get(id: number) {
    return this.userInfoRepository.findOne({ id }).then(nullable("用户不存在"))
  }

  async synchronizationIndexPicture(){
    return this.userInfoDocumentRepository.synchronizationIndexUserInfo(await this.userInfoRepository.find())
  }
}
