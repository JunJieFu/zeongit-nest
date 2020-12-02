import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { TagBlackHoleEntity } from "../../data/entity/beauty/tag-black-hole.entity"

export class TagBlackHoleService {
  constructor(
    @InjectRepository(TagBlackHoleEntity)
    private readonly tagBlackHoleRepository: Repository<TagBlackHoleEntity>
  ) {
  }

  count(userInfoId: number, tag: string) {
    return this.tagBlackHoleRepository.count({
      createdBy: userInfoId,
      tag
    })
  }

}
