import { Injectable } from "@nestjs/common"
import { InjectBeautyAdmin } from "../../data/decorator/inject-beauty-admin.decorator"
import { Repository } from "typeorm"
import { NsfwLevelEntity } from "../../data/entity/beauty-admin/nsfw-level.entity"

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
