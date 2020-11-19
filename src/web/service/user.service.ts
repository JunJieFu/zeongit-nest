import { Injectable } from "@nestjs/common"
import { UserEntity } from "../../data/entity/user.entity"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import {
  paginate,
  IPaginationOptions,
  Pagination
} from "nestjs-typeorm-paginate"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<UserEntity>> {
    return paginate<UserEntity>(this.userRepository, options)
  }

  save() {
    // this.userRepository.createQueryBuilder().orWhere()
    return this.userRepository.save(new UserEntity("123", "456"))
  }
}
