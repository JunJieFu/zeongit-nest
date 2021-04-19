import { Injectable } from "@nestjs/common"
import { InjectBeautyAdmin } from "../../data/decorator/inject-beauty-admin.decorator"
import { Repository } from "typeorm"
import { PixivErrorEntity } from "../../data/entity/beauty-admin/pixiv-error.entity"

@Injectable()
export class PixivErrorService {
  constructor(
    @InjectBeautyAdmin(PixivErrorEntity)
    private readonly pixivErrorRepository: Repository<PixivErrorEntity>
  ) {}

  save(pixivError: PixivErrorEntity) {
    return this.pixivErrorRepository.save(pixivError)
  }
}
