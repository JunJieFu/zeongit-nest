import { InjectBeautyAdmin } from "@/data/decorator/inject-beauty-admin.decorator"
import { NsfwLevelEntity } from "@/data/entity/beauty-admin/nsfw-level.entity"
import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"

@Injectable()
export class NsfwLevelService {
  constructor(
    @InjectBeautyAdmin(NsfwLevelEntity)
    private readonly nsfwLevelRepository: Repository<NsfwLevelEntity>
  ) {}

  list() {
    return this.nsfwLevelRepository.find()
  }
}
