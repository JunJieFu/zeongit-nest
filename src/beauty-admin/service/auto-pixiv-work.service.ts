import { Injectable } from "@nestjs/common"
import { InjectBeautyAdmin } from "../../data/decorator/inject-beauty-admin.decorator"
import { PixivWorkEntity } from "../../data/entity/beauty-admin/pixiv-work.entity"
import { Repository } from "typeorm"
import { AutoPixivWorkEntity } from "../../data/entity/beauty-admin/auto-pixiv-work.entity";

@Injectable()
export class AutoPixivWorkService {
  constructor(
    @InjectBeautyAdmin(AutoPixivWorkEntity)
    private readonly autoPixivWorkRepository: Repository<AutoPixivWorkEntity>) {
  }

  save(pixivWork: PixivWorkEntity) {
    return this.autoPixivWorkRepository.save(pixivWork)
  }
}
