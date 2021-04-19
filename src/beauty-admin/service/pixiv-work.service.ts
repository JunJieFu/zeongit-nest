import { Injectable } from "@nestjs/common"
import { InjectBeautyAdmin } from "../../data/decorator/inject-beauty-admin.decorator"
import { PixivWorkEntity } from "../../data/entity/beauty-admin/pixiv-work.entity"
import { IsNull, Not, Repository } from "typeorm"
import { nullable } from "../../share/fragment/pipe.function"
import { Pageable } from "../../share/model/pageable.model"
import { paginate } from "nestjs-typeorm-paginate"

@Injectable()
export class PixivWorkService {
  constructor(
    @InjectBeautyAdmin(PixivWorkEntity)
    private readonly pixivWorkRepository: Repository<PixivWorkEntity>
  ) {}

  save(pixivWork: PixivWorkEntity) {
    return this.pixivWorkRepository.save(pixivWork)
  }

  countByPixivId(pixivId: string) {
    return this.pixivWorkRepository.count({
      pixivId
    })
  }

  getByPixivId(pixivId: string) {
    return this.pixivWorkRepository
      .findOne({ pixivId })
      .then(nullable("图片不存在"))
  }

  pagingOriginalUrlTask(pageable: Pageable) {
    return paginate(
      this.pixivWorkRepository,
      {
        page: pageable.page,
        limit: pageable.limit
      },
      {
        where: {
          originalUrl: IsNull()
        },
        order: Object.fromEntries(
          pageable.sort.map((it) => [it.key, it.order.toUpperCase()])
        )
      }
    )
  }

  list() {
    return this.pixivWorkRepository.find({
      where: {
        originalUrl: Not(IsNull())
      }
    })
  }

  listByOriginalUrlIsNotNull() {
    return this.pixivWorkRepository.find()
  }

  listByDownload(download: number) {
    return this.pixivWorkRepository.find({ download })
  }
}
