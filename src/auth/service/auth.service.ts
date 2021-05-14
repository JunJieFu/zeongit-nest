import { UserInfoCache } from "@/data/cache/user-info.cache"
import { UserCache } from "@/data/cache/user.cache"
import { InjectAccount } from "@/data/decorator/inject-account.decorator"
import { UserInfoEntity } from "@/data/entity/account/user-info.entity"
import { UserEntity } from "@/data/entity/account/user.entity"
import { nullable } from "@/share/fragment/pipe.function"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { classToPlain } from "class-transformer"
import { Repository } from "typeorm"
import { Payload } from "../model/payload.model"

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userCache: UserCache,
    private readonly userInfoCache: UserInfoCache,
    @InjectAccount(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectAccount(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>
  ) {}

  get(id: number) {
    return this.userCache.get(id)
  }

  getInfo(id: number) {
    return this.userInfoCache.get(id)
  }

  async signUp(phone: string, password: string) {
    const count = await this.userRepository.count({ phone })
    if (count) {
      throw new HttpException("手机号码已存在", HttpStatus.FORBIDDEN)
    }
    const user = await this.save(new UserEntity(phone, password))
    const info = await this.saveInfo(
      new UserInfoEntity(user.id!, "镜花水月", "简介")
    )
    return this.sign(info.id!)
  }

  async signIn(phone: string, password: string) {
    const user = await this.getUserByPhone(phone)
    if (user.password === password) {
      const info = await this.getInfoByUserId(user.id!)
      return this.sign(info.id!)
    }
    throw new HttpException("密码错误", HttpStatus.UNAUTHORIZED)
  }

  async forgot(phone: string, password: string) {
    const user = await this.getUserByPhone(phone)
    user.password = password
    return this.save(user)
  }

  private save(user: UserEntity) {
    return this.userCache.save(user)
  }

  private saveInfo(userInfo: UserInfoEntity) {
    return this.userInfoCache.save(userInfo)
  }

  private getUserByPhone(phone: string) {
    return this.userRepository
      .findOne({
        phone: phone
      })
      .then(nullable("用户不存在"))
  }

  private getInfoByUserId(userId: number) {
    return this.userInfoRepository
      .findOne({ userId })
      .then(nullable("用户不存在"))
  }

  private sign(id: number) {
    return this.jwtService.sign(classToPlain(new Payload(id)))
  }
}
