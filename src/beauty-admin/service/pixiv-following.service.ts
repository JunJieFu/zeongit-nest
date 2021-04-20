import { InjectBeautyAdmin } from "@/data/decorator/inject-beauty-admin.decorator"
import { PixivFollowingEntity } from "@/data/entity/beauty-admin/pixiv-following.entity"
import { nullable } from "@/share/fragment/pipe.function"
import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"

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
