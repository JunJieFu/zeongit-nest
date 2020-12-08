import { Module } from "@nestjs/common"
import { UserController } from "./controller/user.controller"
import { AuthModule } from "../auth/auth.module"
import { DataModule } from "../data/data.module"
import { UserService } from "./service/user.service"
import { AppController } from "./controller/app.controller"
import { VerificationCodeCache } from "./cache/verification-code.cache"
import { QiniuModule } from "../qiniu/qiniu.module"

@Module({
  imports: [DataModule, AuthModule, QiniuModule],
  controllers: [AppController, UserController],
  providers: [UserService, VerificationCodeCache],
  exports: []
})
export class AccountModule {
}
