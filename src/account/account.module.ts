import { AuthModule } from "@/auth/auth.module"
import { DataModule } from "@/data/data.module"
import { QiniuModule } from "@/qiniu/qiniu.module"
import { Module } from "@nestjs/common"
import { VerificationCodeCache } from "./cache/verification-code.cache"
import { UserInfoController } from "./controller/user-info.controller"
import { UserController } from "./controller/user.controller"
import { UserInfoService } from "./service/user-info.service"
import { UserService } from "./service/user.service"

@Module({
  imports: [DataModule, AuthModule, QiniuModule],
  controllers: [UserController, UserInfoController],
  providers: [UserService, UserInfoService, VerificationCodeCache],
  exports: []
})
export class AccountModule {}
