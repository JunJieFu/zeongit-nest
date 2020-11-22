import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "./entity/user.entity"
import { UserInfoEntity } from "./entity/user-info.entity"
import { ConfigModule } from "@nestjs/config"
import { getEnvPaths } from "../share/fragment/env.function"
import { accountConfigType } from "./config"
import { AccountConfigService } from "./config-service/account-config.service"

const configModule = ConfigModule.forRoot(
  {
    envFilePath: [...getEnvPaths()], load: [accountConfigType]
  }
)

@Module({
  imports: [
    configModule,
    TypeOrmModule.forRootAsync({
      imports: [configModule],
      useClass: AccountConfigService,
    }),
    TypeOrmModule.forFeature([UserEntity, UserInfoEntity])
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule]
})
export class DataModule {
}
