import { InjectAccount } from "@/data/decorator/inject-account.decorator"
import { UserInfoEntity } from "@/data/entity/account/user-info.entity"
import { UserInfoDocumentRepository } from "@/data/repository/user-info-document.repository"
import { nullable } from "@/share/fragment/pipe.function"
import { Repository } from "typeorm"

export class UserInfoService {
  constructor(
    @InjectAccount(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>,
    private readonly userInfoDocumentRepository: UserInfoDocumentRepository
  ) {}

  get(id: number) {
    return this.userInfoRepository.findOne({ id }).then(nullable("用户不存在"))
  }

  async synchronizationIndexPicture() {
    return this.userInfoDocumentRepository.synchronizationIndexUserInfo(
      await this.userInfoRepository.find()
    )
  }
}
