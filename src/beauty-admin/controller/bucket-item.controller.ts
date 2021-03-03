import { Body, Controller, Get } from "@nestjs/common"
import { BucketItemService } from "../service/bucket-item.service"
import { PictureService } from "../service/picture.service";
import { PixivWorkDetailService } from "../service/pixiv-work-detail.service";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs")

@Controller("bucketItem")
export class BucketItemController {
  constructor(
    private readonly bucketItemService: BucketItemService,
    private readonly pictureService: PictureService,
    private readonly pixivWorkDetailService: PixivWorkDetailService
  ) {
  }

  @Get("remove")
  async remove() {
    const list = await this.bucketItemService.listSuit()
    for (const item of list) {
      await this.bucketItemService.removeSuit(item)
    }
    return true
  }

  @Get("move")
  async move(@Body("sourcePath") sourcePath: string, @Body("folderPath") folderPath: string) {
    const list = await this.bucketItemService.list()
    const restrictList: string[] = []
    const nullList: string[] = []
    const waitList: string[] = []
    for (const item of list) {
      try {
        fs.renameSync(`${sourcePath}/${item.key}`, `${folderPath}/${item.key}`)
      } catch (e) {
        try {
          const workDetail = await this.pixivWorkDetailService.getByUrl(item.key)
          if (workDetail.xRestrict === 1) {
            restrictList.push(item.key)
          } else {
            waitList.push(item.key)
          }
        } catch (e) {
          nullList.push(item.key)
        }
      }
    }

    fs.writeFileSync("D:\\my\\图片\\p\\restrictList.json",
      JSON.stringify(restrictList)
    )
    fs.writeFileSync("D:\\my\\图片\\p\\nullList.json",
      JSON.stringify(nullList)
    )
    fs.writeFileSync("D:\\my\\图片\\p\\waitList.json",
      JSON.stringify(waitList)
    )
    return true
  }
}
