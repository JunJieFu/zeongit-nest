import { nullable } from "@/share/fragment/pipe.function"
import { CacheStore, CACHE_MANAGER, Inject, Injectable } from "@nestjs/common"
import { CodeTypeConstant } from "../constant/code-type.constant"

const GET_KEY = "verification_code:get:"

@Injectable()
export class VerificationCodeCache {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore
  ) {}

  get(phone: string, type: CodeTypeConstant) {
    return (this.cacheManager.get(GET_KEY + type + ":" + phone) as Promise<
      string | undefined
    >).then(nullable("验证码不存在"))
  }

  async save(phone: string, type: CodeTypeConstant, code: string) {
    await this.cacheManager.set(GET_KEY + type + ":" + phone, code, {
      ttl: 600
    })
    return code
  }

  remove(phone: string, type: CodeTypeConstant) {
    return this.cacheManager.del(GET_KEY + type + ":" + phone)
  }
}
