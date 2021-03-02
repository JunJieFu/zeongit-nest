import { Injectable } from "@nestjs/common"
import { InjectBeautyAdmin } from "../../data/decorator/inject-beauty-admin.decorator"
import { Like, Not, Repository } from "typeorm"
import { BucketItemEntity } from "../../data/entity/beauty-admin/bucket-item.entity"

@Injectable()
export class BucketItemService {
  constructor(
    @InjectBeautyAdmin(BucketItemEntity)
    private readonly bucketItemRepository: Repository<BucketItemEntity>) {
  }

  save(key: string) {
    return this.bucketItemRepository.insert(new BucketItemEntity(key))
  }

  listSuit() {
    return this.bucketItemRepository.find({
      where: {
        key: Not(Like("%_p0%"))
      }
    })
  }
}
