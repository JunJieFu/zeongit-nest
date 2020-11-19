import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { UserEntity } from "../../data/entity/user.entity"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate"


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<UserEntity>> {
    return paginate<UserEntity>(this.userRepository, options)
  }

  get(id: number) {
    const user = this.userRepository.findOne({ id })
    if (user) return user
    throw new HttpException("为空", HttpStatus.UNAUTHORIZED)
  }

  save() {
    return this.userRepository.save(new UserEntity("123", "456"))
  }
}
