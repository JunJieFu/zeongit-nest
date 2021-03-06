import { InjectBeautyAdmin } from "@/data/decorator/inject-beauty-admin.decorator"
import { AutoPixivWorkEntity } from "@/data/entity/beauty-admin/auto-pixiv-work.entity"
import { PixivWorkEntity } from "@/data/entity/beauty-admin/pixiv-work.entity"
import { nullable } from "@/share/fragment/pipe.function"
import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"

@Injectable()
export class AutoPixivWorkService {
  constructor(
    @InjectBeautyAdmin(AutoPixivWorkEntity)
    private readonly autoPixivWorkRepository: Repository<AutoPixivWorkEntity>
  ) {}

  save(pixivWork: PixivWorkEntity) {
    return this.autoPixivWorkRepository.save(pixivWork)
  }

  list() {
    return this.autoPixivWorkRepository.find()
  }

  getByDownload(download: number) {
    return this.autoPixivWorkRepository
      .findOne({
        where: {
          download
        },
        order: {
          collectAmount: "ASC"
        }
      })
      .then(nullable("图片不存在"))
  }
}
