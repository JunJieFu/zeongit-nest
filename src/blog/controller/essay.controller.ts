import { Controller, Get, Query } from "@nestjs/common"
import { EssayService } from "../service/essay.service";

@Controller("essay")
export class EssayController {
  constructor(
    private readonly essayService: EssayService
  ) {
  }

  @Get("listOnYear")
  listOnYear(@Query("year") year: number) {
    return this.essayService.listOnYear(year)
  }
}
