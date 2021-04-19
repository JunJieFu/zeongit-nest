import { Injectable } from "@nestjs/common"
import { InjectBeautyAdmin } from "../../data/decorator/inject-beauty-admin.decorator"
import { Repository } from "typeorm"
import { PixivFollowingEntity } from "../../data/entity/beauty-admin/pixiv-following.entity"
import { nullable } from "../../share/fragment/pipe.function"

@Injectable()
export class PixivFollowingService {
  constructor(
    @InjectBeautyAdmin(PixivFollowingEntity)
    private readonly pixivFollowingEntity: Repository<PixivFollowingEntity>
  ) {}

  save(pixivFollowing: PixivFollowingEntity) {
    return this.pixivFollowingEntity.save(pixivFollowing)
  }

  get() {
    return this.pixivFollowingEntity
      .findOne({
        order: {
          page: "ASC"
        }
      })
      .then(nullable("关注不存在"))
  }
}
