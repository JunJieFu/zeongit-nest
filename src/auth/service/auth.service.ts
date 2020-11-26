import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "../../data/entity/user.entity"
import { Repository } from "typeorm"
import { UserInfoEntity } from "../../data/entity/user-info.entity"
import { ConfigType } from "@nestjs/config"
import { jwtConfigType } from "../config"
import { fromPromise } from "rxjs/internal-compatibility"
import { nullable } from "../../share/fragment/pipe.function"
import { map, mergeMap } from "rxjs/operators"
import { UserInfoCache } from "../../data/cache/user-info.cache"
import { Payload } from "../model/payload.model"
import { UserCache } from "../../data/cache/user.cache"

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

  signUp(phone: string, password: string) {
    return fromPromise(this.userRepository.count({ phone })).pipe(
      mergeMap(count => {
        if (count) {
          throw new HttpException("手机号码已存在", HttpStatus.FORBIDDEN)
        }
        return this.save(new UserEntity(phone, password))
      }), mergeMap(user => this.saveInfo(
        new UserInfoEntity(user.id!, "镜花水月", "简介")
      )), map(info => this.sign(info.id!)))
  }

  signIn(phone: string, password: string) {
    this.getUserByPhone(phone).pipe(
      mergeMap(user => {
        if (user.password === password) {
          return this.getInfoByUserId(user.id!)
        }
        throw new HttpException("密码错误", HttpStatus.UNAUTHORIZED)
      }), map(info => this.sign(info.id!)))
  }

  forgot(phone: string, password: string) {
    return this.getUserByPhone(phone).pipe(mergeMap(user => {
        user.password = password
        return this.save(user)
      }
    ))
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
    })).pipe(nullable("用户不存在"))
  }

  private getInfoByUserId(userId: number) {
    return fromPromise(this.userInfoRepository.findOne({ userId })).pipe(
      nullable("用户不存在")
    )
  }

  private sign(id: number) {
    return this.jwtService.sign(new Payload(id))
  }
}
