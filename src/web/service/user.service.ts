import { Injectable, NotFoundException } from "@nestjs/common"
import { UserEntity } from "../../data/entity/user.entity"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { IPaginationOptions, paginate } from "nestjs-typeorm-paginate"
import { fromPromise } from "rxjs/internal-compatibility"
import { CodeTypeConstant } from "../constant/code-type.constant"
import { map, mergeMap } from "rxjs/operators"
import { VerificationCodeCache } from "../cache/verification-code.cache"
import { ProgramException } from "../../share/exception/program.exception"
import { UserCache } from "../../data/cache/user.cache"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userCache: UserCache,
    private readonly verificationCodeCache: VerificationCodeCache
  ) {
  }

  sendCode(phone: string, type: CodeTypeConstant) {
    let code = ""
    while (code.length < 6) {
      code += (Math.round(Math.random() * 100)).toString()
    }
    this.countByPhone(phone).pipe(map(count => {
      if (type === CodeTypeConstant.SIGN_UP && count) {
        throw new ProgramException("手机号码已存在")
      }
      if (type === CodeTypeConstant.FORGOT && !count) {
        throw new NotFoundException("手机号码不存在")
      }
      return this.verificationCodeCache.save(phone, type, code)
    }))
  }

  validator(phone: string, type: CodeTypeConstant, code: string) {
    return this.verificationCodeCache.get(phone, type).pipe(mergeMap(sourceCode => {
      if (code !== sourceCode) throw new ProgramException("验证码无效")
      return this.verificationCodeCache.remove(phone, type)
    }))
  }

  countByPhone(phone: string) {
    return fromPromise(this.userRepository.count({
      phone
    }))
  }

  get(id: number) {
    return this.userCache.get(id)
  }

  save(user: UserEntity) {
    return this.userCache.save(user)
  }

  paginate(options: IPaginationOptions) {
    return fromPromise(paginate<UserEntity>(this.userRepository, options))
  }
}
