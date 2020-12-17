import { Injectable } from "@nestjs/common"
import { InjectBeautyAdmin } from "../../data/decorator/inject-beauty-admin.decorator"
import { Repository } from "typeorm"
import { PixivUserEntity } from "../../data/entity/beauty-admin/pixiv-user.entity"
import { nullable } from "../../share/fragment/pipe.function"


@Injectable()
export class PixivUserService {
  constructor(
    @InjectBeautyAdmin(PixivUserEntity)
    private readonly pixivUserRepository: Repository<PixivUserEntity>) {
  }

  save(pixivUser: PixivUserEntity) {
    return this.pixivUserRepository.save(pixivUser)
  }

  countByPixivUserId(pixivUserId: string) {
    return this.pixivUserRepository.count({ pixivUserId })
  }

  getByPixivUserId(pixivUserId: string) {
    return this.pixivUserRepository.findOne({ pixivUserId }).then(nullable("用户不存在"))
  }
}
