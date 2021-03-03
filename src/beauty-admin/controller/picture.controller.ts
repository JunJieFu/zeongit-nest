import { Controller, Get } from "@nestjs/common"
import { PictureService } from "../service/picture.service"

@Controller("picture")
export class PictureController {
  constructor(
    private readonly  pictureService: PictureService
  ) {
  }

  @Get("remove")
  async remove() {
    const list = await this.pictureService.listSuit()
    for (const item of list) {
      await this.pictureService.remove(item)
    }
    return true
  }
}
