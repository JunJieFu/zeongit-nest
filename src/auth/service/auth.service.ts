import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { UserEntity } from "../../data/entity/user.entity"
import { Repository } from "typeorm"
import { UserInfoEntity } from "../../data/entity/user_info.entity"

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserInfoEntity)
    private readonly userInfoRepository: Repository<UserInfoEntity>
  ) {}

  private async getUserByPhone(phone: string) {
    const user = await this.userRepository.findOne({
      phone: phone
    })
    if (!user) throw new HttpException("为空", HttpStatus.NOT_FOUND)
    return user
  }

  async getInfo(id: number) {
    const info = await this.userInfoRepository.findOne({ id })
    if (!info) throw new HttpException("为空", HttpStatus.NOT_FOUND)
    return info
  }

  private async getInfoByUserId(userId: number) {
    const info = await this.userInfoRepository.findOne({ userId })
    if (!info) throw new HttpException("为空", HttpStatus.NOT_FOUND)
    return info
  }

  private saveInfo(userInfo: UserInfoEntity) {
    return this.userInfoRepository.save(userInfo)
  }

  async signUp(phone: string, password: string) {
    if (await this.userRepository.count({ phone })) {
      throw new HttpException("手机号码已存在", HttpStatus.FORBIDDEN)
    }
    const user = await this.userRepository.save(new UserEntity(phone, password))
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

  private sign(id: number) {
    return this.jwtService.sign({ id })
  }
}
