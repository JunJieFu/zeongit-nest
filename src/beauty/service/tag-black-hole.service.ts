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

  async listBlacklist(userInfoId?: number) {
    const userBlacklist: string[] = []
    if (userInfoId) {
      userBlacklist.push.apply(null, (await this.tagBlackHoleRepository.find({
        createdBy: userInfoId
      })).map(it => it.tag))
    }
    return userBlacklist
  }
}
