import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { nullable } from "../../share/fragment/pipe.function"
import { UserEntity } from "../../data/entity/account/user.entity"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { UserInfoService } from "./user-info.service"
import { InjectAccount } from "../../data/decorator/inject-account.decorator"
import { UserCache } from "../../data/cache/user.cache";

@Injectable()
export class UserService {
  constructor(
    @InjectAccount(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userInfoService: UserInfoService,
    private readonly userCache: UserCache
  ) {
  }

  get(id: number) {
    return this.userRepository.findOne({id}).then(nullable("用户不存在"))
  }

  getByPhone(phone: string) {
    return this.userRepository.findOne({phone}).then(nullable("用户不存在"))
  }

  countByPhone(phone: string) {
    return this.userRepository.count({phone})
  }

  async signUp(phone: string, password: string) {
    const count = await this.userRepository.count({phone})
    if (count) {
      throw new HttpException("手机号码已存在", HttpStatus.FORBIDDEN)
    }
    const user = await this.save(new UserEntity(phone, password))
    return this.userInfoService.save(
      new UserInfoEntity(user.id!, "镜花水月", "简介")
    )
  }

  private save(user: UserEntity) {
    return this.userCache.save(user)
  }
}
