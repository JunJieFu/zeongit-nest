import { Module } from "@nestjs/common"
import { UserController } from "./controller/user.controller"
import { AuthModule } from "../auth/auth.module"
import { DataModule } from "../data/data.module"
import { UserService } from "./service/user.service"
import { AppController } from "./controller/app.controller"
import { VerificationCodeCache } from "./cache/verification-code.cache"
import { QiniuModule } from "../qiniu/qiniu.module"
import { UserInfoController } from "./controller/user-info.controller"
import { UserInfoService } from "./service/user-info.service"

@Module({
  imports: [DataModule, AuthModule, QiniuModule],
  controllers: [AppController, UserController, UserInfoController],
  providers: [UserService, UserInfoService, VerificationCodeCache],
  exports: []
})
export class AccountModule {
}
