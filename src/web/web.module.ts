import { CacheModule, Module } from "@nestjs/common"
import { UserController } from "./controller/user.controller"
import { AuthModule } from "../auth/auth.module"
import { DataModule } from "../data/data.module"
import { UserService } from "./service/user.service"
import { AppController } from "./controller/app.controller"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const redisStore = require("cache-manager-redis-store")

console.log(redisStore)

@Module({
  imports: [AuthModule, DataModule, CacheModule.register({
    store: redisStore,
    host: "localhost",
    port: 6379,
    ttl: 100
  })],
  controllers: [AppController, UserController],
  providers: [UserService],
  exports: []
})
export class WebModule {
}
