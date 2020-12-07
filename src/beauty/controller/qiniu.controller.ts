import { Controller, Get, Inject } from "@nestjs/common"
import { JwtAuth } from "../../auth/decorator/jwt-auth.decorator"
import { ConfigType } from "@nestjs/config"
import { qiniuConfigType } from "../../qiniu/config"

@Controller("qiniu")
class QiniuController {
  constructor(@Inject(qiniuConfigType.KEY)
              private qiniuConfig: ConfigType<typeof qiniuConfigType>) {
  }

  @JwtAuth()
  @Get("get")
  get() {
    return this.qiniuConfig.qiniuAccessKey
  }
}