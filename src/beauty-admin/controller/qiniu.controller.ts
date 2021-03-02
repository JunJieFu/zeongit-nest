import { Controller, Get, Inject, Query } from "@nestjs/common"
import { ConfigType } from "@nestjs/config"
import { qiniuConfigType } from "../../qiniu/config"
import { BucketService } from "../../qiniu/service/bucket.service"
import { BucketItemService } from "../service/bucket-item.service"

@Controller("qiniu")
export class QiniuController {
  constructor(@Inject(qiniuConfigType.KEY)
              private qiniuConfig: ConfigType<typeof qiniuConfigType>,
              private readonly bucketService: BucketService,
              private readonly bucketItemService: BucketItemService
  ) {
  }

  @Get("removeSuit")
  async removeSuit() {
    const list = await this.bucketItemService.listSuit()
    // return this.bucketService.move(list[0].key, this.qiniuConfig.pictureBucket, this.qiniuConfig.temporaryBucket)
    const newList = []
    for (let i = 0; i <= Math.floor(list.length / 7); i++) {
      newList.push([] as string[])
    }
    console.log(newList.length)
    for (const index in list) {
      newList[Math.floor(index as unknown as number % newList.length)].push(list[index]?.key)
    }
    for (const item of newList) {
      Promise.all(item.map(it => this.bucketService.move(it, this.qiniuConfig.pictureBucket, this.qiniuConfig.temporaryBucket)))
      await new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 500)
      })
    }
    return newList
  }

  @Get("test")
  async test(@Query("marker") marker?: string) {
    const body = await this.bucketService.getList(this.qiniuConfig.pictureBucket, 30000, marker)
    for (const item of body.items) {
      await this.bucketItemService.save(item.key)
    }
    return body.marker
  }
}
