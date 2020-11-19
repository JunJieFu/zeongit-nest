import { Module } from "@nestjs/common"
import { AppController } from "./controller/app.controller"
import { AuthModule } from "../auth/auth.module"
import { DataModule } from "../data/data.module"
import { UserService } from "./service/user.service"

@Module({
  imports: [AuthModule, DataModule],
  controllers: [AppController],
  providers: [UserService],
  exports: []
})
export class WebModule {}
