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
}
