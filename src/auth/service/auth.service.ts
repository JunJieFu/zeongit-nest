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

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfigType.KEY)
    private jwtConfig: ConfigType<typeof jwtConfigType>,
    private readonly jwtService: JwtService,
    private readonly userInfoCache: UserInfoCache,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>
  ) {
  }

  private getUserByPhone(phone: string) {
    return fromPromise(this.userRepository.findOne({
      phone: phone
    })).pipe(map(nullable("用户不存在")))
  }

  getInfo(id: number) {
    return this.userInfoCache.get(id)
  }

  private getInfoByUserId(userId: number) {
    return fromPromise(this.userInfoRepository.findOne({ userId })).pipe(
      map(nullable("用户不存在"))
    )
  }

  private saveInfo(userInfo: UserInfoEntity) {
    return this.userInfoRepository.save(userInfo)
  }

  signUp(phone: string, password: string) {
    return fromPromise(this.userRepository.count({ phone })).pipe(
      mergeMap(count => {
        if (count) {
          throw new HttpException("手机号码已存在", HttpStatus.FORBIDDEN)
        }
        return fromPromise(this.userRepository.save(new UserEntity(phone, password)))
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

  private sign(id: number) {
    return this.jwtService.sign({ id })
  }

  test() {
    return this.jwtConfig.secretKey
  }
}
