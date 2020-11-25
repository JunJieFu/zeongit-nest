import { Injectable } from "@nestjs/common"
import { UserEntity } from "../../data/entity/user.entity"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { IPaginationOptions, paginate } from "nestjs-typeorm-paginate"
import { fromPromise } from "rxjs/internal-compatibility"


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {
  }

  paginate(options: IPaginationOptions) {
    return fromPromise(paginate<UserEntity>(this.userRepository, options))
  }
}
