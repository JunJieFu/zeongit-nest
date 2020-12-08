import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { getEnvPaths } from "../share/fragment/env.function"
import { qiniuConfigType } from "./config"
import { BucketService } from "./service/bucket.service"

const configModule = ConfigModule.forRoot(
  {
    envFilePath: [...getEnvPaths()], load: [qiniuConfigType]
  }
)

@Module({
  imports: [
    configModule
  ],
  controllers: [],
  providers: [BucketService],
  exports: [BucketService]
})
export class QiniuModule {
}