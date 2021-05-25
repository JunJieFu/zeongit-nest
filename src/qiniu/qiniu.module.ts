import { HttpModule, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { qiniuConfigType } from "./config"
import { BucketService } from "./service/bucket.service"

const configModule = ConfigModule.forRoot({
  envFilePath: [`.env`, `.env.${process.env.NODE_ENV!.trim()}`],
  load: [qiniuConfigType]
})

@Module({
  imports: [configModule, HttpModule],
  controllers: [],
  providers: [BucketService],
  exports: [configModule, BucketService]
})
export class QiniuModule {}
