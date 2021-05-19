import { Controller, Get, Query } from "@nestjs/common"
import { PictureSuggestDocumentService } from "../service/picture-suggest-document.service"

@Controller("suggest")
export class SuggestController {
  constructor(
    private readonly pictureSuggestDocumentService: PictureSuggestDocumentService
  ) {}

  @Get("search")
  async search(@Query("keyword") keyword: string) {
    return this.pictureSuggestDocumentService.search(keyword)
  }
}
