import { Body, Controller, Get, Post } from "@nestjs/common"
import { BucketItemService } from "../service/bucket-item.service"
import { PictureService } from "../service/picture.service"
import { PixivWorkDetailService } from "../service/pixiv-work-detail.service"
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
      await this.bucketItemService.remove(item)
    }
    return true
  }

  @Post("move")
  async move(@Body("sourcePath") sourcePath: string, @Body("folderPath") folderPath: string) {
    const list = await this.bucketItemService.list()
    const restrictList: string[] = []
    const nullList: string[] = []
    const waitList: string[] = []
    for (const item of list) {
      try {
        fs.renameSync(`${sourcePath}/${item.key}`, `${folderPath}/${item.key}`)
        this.bucketItemService.remove(item).then()
      } catch (e) {
        console.log(e)
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

    fs.writeFileSync("D:\\my\\图片\\p\\source\\restrictList.json",
      JSON.stringify(restrictList)
    )
    fs.writeFileSync("D:\\my\\图片\\p\\source\\nullList.json",
      JSON.stringify(nullList)
    )
    fs.writeFileSync("D:\\my\\图片\\p\\source\\waitList.json",
      JSON.stringify(waitList)
    )
    return true
  }
}
