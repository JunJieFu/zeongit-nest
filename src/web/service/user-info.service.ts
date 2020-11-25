import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { UserInfoEntity } from "../../data/entity/user-info.entity"


@Injectable()
export class UserInfoService {
  constructor(
    @InjectRepository(UserInfoEntity)
    private readonly userRepository: Repository<UserInfoEntity>
  ) {
  }
}
