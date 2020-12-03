import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UserBlackHoleEntity } from "../../data/entity/beauty/user-black-hole.entity"

export class UserBlackHoleService {
  constructor(
    @InjectRepository(UserBlackHoleEntity)
    private readonly userBlackHoleRepository: Repository<UserBlackHoleEntity>
  ) {
  }

  count(userInfoId: number, targetId: number) {
    return this.userBlackHoleRepository.count({
      createdBy: userInfoId,
      targetId
    })
  }

  async listBlacklist(userInfoId?: number) {
    const userBlacklist: number[] = []
    if (userInfoId) {
      userBlacklist.push.apply(null, (await this.userBlackHoleRepository.find({
        createdBy: userInfoId
      })).map(it => it.targetId))
    }
    return userBlacklist
  }
}
