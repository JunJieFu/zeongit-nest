import { JwtAuth } from "@/auth/decorator/jwt-auth.decorator"
import { qiniuConfigType } from "@/qiniu/config"
import { BucketService } from "@/qiniu/service/bucket.service"
import { Controller, Get, Inject } from "@nestjs/common"
import { ConfigType } from "@nestjs/config"

@Controller("qiniu")
export class QiniuController {
  constructor(
    @Inject(qiniuConfigType.KEY)
    private qiniuConfig: ConfigType<typeof qiniuConfigType>,
    private readonly bucketService: BucketService
  ) {}

  @JwtAuth()
  @Get("get")
  get() {
    return this.bucketService.getToken(this.qiniuConfig.avatarBucket)
  }
}
