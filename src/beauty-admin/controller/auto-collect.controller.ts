import { Controller, Get, HttpService } from "@nestjs/common"
import { AutoCollectPick } from "../dto";
import { AutoPixivWorkEntity } from "../../data/entity/beauty-admin/auto-pixiv-work.entity";
import { AutoPixivWorkService } from "../service/auto-pixiv-work.service";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";

@Controller("autoCollect")
export class AutoCollectController {
  constructor(
    private readonly autoPixivWorkService: AutoPixivWorkService,
    private readonly httpService: HttpService
  ) {
  }

  @Get("insert")
  async insert() {
    console.log(123)
    const vo = await this.httpService.get("https://hibiapi.getloli.com/api/pixiv/?type=rank&mode=day&page=1&date=2021-03-01").pipe(map(it => plainToClass(AutoCollectPick, it.data))).toPromise()
    console.log(vo.illusts)
    for (const item of vo.illusts) {
      if (item.page_count === 1) {
        const auto = new AutoPixivWorkEntity()
        auto.pixivId = String(item.id)
        auto.title = item.title
        auto.xRestrict = item.x_restrict
        auto.pixivRestrict = item.restrict
        auto.description = item.caption
        auto.tags = item.tags.map(it => it.name).join("|")
        auto.translateTags = item.tags.map(it => it.translated_name ?? it.name).join("|")
        auto.userId = String(item.user.id)
        auto.userName = item.user.name
        auto.width = item.width
        auto.height = item.height
        auto.pageCount = item.page_count
        auto.pixivCreateDate = item.create_date
        auto.originalUrl = item.meta_single_page.original_image_url
        auto.totalView = item.total_view
        auto.totalBookmarks = item.total_bookmarks
        auto.sl = item.sanity_level
        try {
          await this.autoPixivWorkService.save(auto)
        } catch (e) {
          console.log(e)
        }
      }
    }
    return true
  }

  @Get("test")
  test() {
    return 1
  }
}
