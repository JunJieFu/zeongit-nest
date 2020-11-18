import { Module } from "@nestjs/common"
import { AppController } from "./controller/app.controller"
import { AuthModule } from "../auth/auth.module"

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [],
  exports:[]
})
export class WebModule {
}
