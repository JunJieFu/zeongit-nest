import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { PictureBlackHoleEntity } from "../../data/entity/beauty/picture-black-hole.entity"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"

export class PictureBlackHoleService {
  constructor(
    @InjectRepository(PictureBlackHoleEntity)
    private readonly pictureBlackHoleRepository: Repository<PictureBlackHoleEntity>
  ) {
  }

  count(userInfoId: number, targetId: number) {
    return this.pictureBlackHoleRepository.count({
      createdBy: userInfoId,
      targetId
    })
  }

  save(targetId: number, { id: userInfoId }: UserInfoEntity) {
    return this.pictureBlackHoleRepository.save(new PictureBlackHoleEntity(userInfoId!, targetId))
  }

  remove(targetId: number, { id: userInfoId }: UserInfoEntity) {
    return this.pictureBlackHoleRepository.delete({
      createdBy: userInfoId,
      targetId
    })
  }

}
