import { Controller, Get, Inject, Query } from "@nestjs/common"
import { ConfigType } from "@nestjs/config"
import { qiniuConfigType } from "../../qiniu/config"
import { BucketService } from "../../qiniu/service/bucket.service"
import { BucketItemService } from "../service/bucket-item.service";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs")

@Controller("qiniu")
export class QiniuController {
  constructor(@Inject(qiniuConfigType.KEY)
              private qiniuConfig: ConfigType<typeof qiniuConfigType>,
              private readonly bucketService: BucketService,
              private readonly bucketItemService: BucketItemService
  ) {
  }

  @Get("test")
  async test(@Query("marker") marker?: string) {
    const body = await this.bucketService.getList(this.qiniuConfig.pictureBucket, 30000, marker)
    // fs.writeFileSync("D:\\bucket.txt",
    //   body.items.map(it => it.key).join("\r\n"))
    for (const item of body.items) {
      await this.bucketItemService.save(item.key)
    }
    return body.marker
  }
}
