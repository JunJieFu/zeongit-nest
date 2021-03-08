import { Injectable } from "@nestjs/common"
import { InjectBeautyAdmin } from "../../data/decorator/inject-beauty-admin.decorator"
import { Repository } from "typeorm"
import { PixivFollowingEntity } from "../../data/entity/beauty-admin/pixiv-following.entity"

@Injectable()
export class PixivFollowingService {
  constructor(
    @InjectBeautyAdmin(PixivFollowingEntity)
    private readonly pixivFollowingEntity: Repository<PixivFollowingEntity>) {
  }
}
