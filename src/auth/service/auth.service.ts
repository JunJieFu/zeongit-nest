import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "../../data/entity/account/user.entity"
import { Repository } from "typeorm"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { ConfigType } from "@nestjs/config"
import { jwtConfigType } from "../config"
import { fromPromise } from "rxjs/internal-compatibility"
import { nullable } from "../../share/fragment/pipe.function"
import { UserInfoCache } from "../../data/cache/user-info.cache"
import { Payload } from "../model/payload.model"
import { UserCache } from "../../data/cache/user.cache"
import { classToPlain } from "class-transformer"

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfigType.KEY)
    private jwtConfig: ConfigType<typeof jwtConfigType>,
    private readonly jwtService: JwtService,
    private readonly userCache: UserCache,
    private readonly userInfoCache: UserInfoCache,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>
  ) {
  }

  get(id: number) {
    return this.userCache.get(id)
  }

  getInfo(id: number) {
    return this.userInfoCache.get(id)
  }

  async signUp(phone: string, password: string) {
    const count  = this.userRepository.count({ phone })
    if (count) {
      throw new HttpException("手机号码已存在", HttpStatus.FORBIDDEN)
    }
    const user = await  this.save(new UserEntity(phone, password))
    const info = await this.saveInfo(
      new UserInfoEntity(user.id!, "镜花水月", "简介")
    )
    return this.sign(info.id!)
  }

  async signIn(phone: string, password: string) {
    const user = await this.getUserByPhone(phone)
    if (user.password === password) {
      const info = await  this.getInfoByUserId(user.id!)
      return this.sign(info.id!)
    }
    throw new HttpException("密码错误", HttpStatus.UNAUTHORIZED)
  }

  async forgot(phone: string, password: string) {
    const user = await this.getUserByPhone(phone)
    user.password = password
    return this.save(user)
  }

  private save(user: UserEntity){
    return this.userCache.save(user)
  }

  private saveInfo(userInfo: UserInfoEntity){
    return this.userInfoCache.save(userInfo)
  }

  private getUserByPhone(phone: string) {
    return fromPromise(this.userRepository.findOne({
      phone: phone
    })).pipe(nullable("用户不存在")).toPromise()
  }

  private getInfoByUserId(userId: number) {
    return fromPromise(this.userInfoRepository.findOne({ userId })).pipe(
      nullable("用户不存在")
    ).toPromise()
  }

  private sign(id: number) {
    return this.jwtService.sign(classToPlain(new Payload(id)))
  }
}
