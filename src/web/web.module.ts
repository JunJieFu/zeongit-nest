import { CacheModule, Module } from "@nestjs/common"
import { UserController } from "./controller/user.controller"
import { AuthModule } from "../auth/auth.module"
import { DataModule } from "../data/data.module"
import { UserService } from "./service/user.service"
import { AppController } from "./controller/app.controller"
import { getEnvPaths } from "../share/fragment/env.function"
import { cacheConfigType } from "./config"
import { CacheConfigService } from "./service/cache-config.service"
import { ConfigModule } from "@nestjs/config"

const configModule = ConfigModule.forRoot(
  {
    envFilePath: [...getEnvPaths()], load: [cacheConfigType]
  }
)

@Module({
  imports: [configModule, DataModule, CacheModule.registerAsync(
    {
      imports: [configModule],
      useClass: CacheConfigService
    }
  ),
    AuthModule],
  controllers: [AppController, UserController],
  providers: [UserService],
  exports: []
})
export class WebModule {
}
