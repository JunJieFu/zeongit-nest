import { InjectBeautyAdmin } from "@/data/decorator/inject-beauty-admin.decorator"
import { PixivWorkDetailEntity } from "@/data/entity/beauty-admin/pixiv-work-detail.entity"
import { nullable } from "@/share/fragment/pipe.function"
import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"

@Injectable()
export class PixivWorkDetailService {
  constructor(
    @InjectBeautyAdmin(PixivWorkDetailEntity)
    private readonly pixivWorkDetailRepository: Repository<
      PixivWorkDetailEntity
    >
  ) {}

  save(pixivWorkDetail: PixivWorkDetailEntity) {
    return this.pixivWorkDetailRepository.save(pixivWorkDetail)
  }

  getByName(name: string) {
    return this.pixivWorkDetailRepository
      .findOne({ name })
      .then(nullable("图片不存在"))
  }

  getByUrl(url: string) {
    return this.pixivWorkDetailRepository
      .findOne({ url })
      .then(nullable("图片不存在"))
  }

  listByPixivId(pixivId: string) {
    return this.pixivWorkDetailRepository.find({
      pixivId
    })
  }

  listByDownload(download: number) {
    return this.pixivWorkDetailRepository.find({ download })
  }

  list() {
    return this.pixivWorkDetailRepository.find()
  }

  listByWidth(width: number) {
    return this.pixivWorkDetailRepository.find({ width })
  }

  async saveAll(pixivWorkDetailList: PixivWorkDetailEntity[]) {
    for (const pixivWorkDetail of pixivWorkDetailList) {
      await this.pixivWorkDetailRepository.save(pixivWorkDetail)
    }
    return true
  }
}
