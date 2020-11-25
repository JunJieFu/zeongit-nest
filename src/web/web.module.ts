import { Module } from "@nestjs/common"
import { UserController } from "./controller/user.controller"
import { AuthModule } from "../auth/auth.module"
import { DataModule } from "../data/data.module"
import { UserService } from "./service/user.service"
import { AppController } from "./controller/app.controller"

@Module({
  imports: [DataModule,
    AuthModule],
  controllers: [AppController, UserController],
  providers: [UserService],
  exports: []
})
export class WebModule {
}
