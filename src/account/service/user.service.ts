import { UserCache } from "@/data/cache/user.cache"
import { InjectAccount } from "@/data/decorator/inject-account.decorator"
import { UserEntity } from "@/data/entity/account/user.entity"
import { ProgramException } from "@/share/exception/program.exception"
import { Injectable, NotFoundException } from "@nestjs/common"
import { IPaginationOptions, paginate } from "nestjs-typeorm-paginate"
import { Repository } from "typeorm"
import { VerificationCodeCache } from "../cache/verification-code.cache"
import { CodeTypeConstant } from "../constant/code-type.constant"

@Injectable()
export class UserService {
  constructor(
    @InjectAccount(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userCache: UserCache,
    private readonly verificationCodeCache: VerificationCodeCache
  ) {}

  async sendCode(phone: string, type: CodeTypeConstant) {
    let code = ""
    while (code.length < 6) {
      code += Math.round(Math.random() * 100).toString()
    }
    const count = await this.countByPhone(phone)
    if (type === CodeTypeConstant.SIGN_UP && count) {
      throw new ProgramException("手机号码已存在")
    }
    if (type === CodeTypeConstant.FORGOT && !count) {
      throw new NotFoundException("手机号码不存在")
    }
    return this.verificationCodeCache.save(phone, type, code)
  }

  async validator(phone: string, type: CodeTypeConstant, code: string) {
    const sourceCode = await this.verificationCodeCache.get(phone, type)
    if (code !== sourceCode) throw new ProgramException("验证码无效")
    return this.verificationCodeCache.remove(phone, type)
  }

  countByPhone(phone: string) {
    return this.userRepository.count({
      phone
    })
  }

  get(id: number) {
    return this.userCache.get(id)
  }

  save(user: UserEntity) {
    return this.userCache.save(user)
  }

  paginate(options: IPaginationOptions) {
    return paginate<UserEntity>(this.userRepository, options)
  }
}
