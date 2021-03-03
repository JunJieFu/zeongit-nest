import { Get, HttpService, Injectable } from "@nestjs/common"
import { Interval } from "@nestjs/schedule";
import { AutoPixivWorkService } from "./auto-pixiv-work.service";
import { BucketService } from "../../qiniu/service/bucket.service";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";
import { AutoCollectPick } from "../dto";
import { format } from "../../share/uitl/date.util";
import { AutoPixivWorkEntity } from "../../data/entity/beauty-admin/auto-pixiv-work.entity";
import { PictureEntity } from "../../data/entity/beauty/picture.entity";
import { Gender } from "../../data/constant/gender.constant";
import { UserService } from "./user.service";
import { UserInfoService } from "./user-info.service";
import { PixivUserService } from "./pixiv-user.service";
import { UserInfoEntity } from "../../data/entity/account/user-info.entity";
import { PixivUserEntity } from "../../data/entity/beauty-admin/pixiv-user.entity";
import { TagEntity } from "../../data/entity/beauty/tag.entity";
import { PictureService } from "./picture.service";

@Injectable()
export class AutoCollectService {
  constructor(
    private readonly autoPixivWorkService: AutoPixivWorkService,
    private readonly httpService: HttpService,
    private readonly bucketService: BucketService,
    private readonly pixivUserService: PixivUserService,
    private readonly userService: UserService,
    private readonly userInfoService: UserInfoService,
    private readonly pictureService: PictureService,
  ) {
  }

  private pages = [1,1,1]
  private userInfoId = 1
  private readonly types = ["day_male", "week_original", "week_rookie"]
  @Interval(1000 * 60 * 30)
  async collect() {
    const typeIndex = parseInt(String(Math.random() * 3), 10)
    const vo = await this.httpService.get(`https://hibiapi.getloli.com/api/pixiv/?type=rank&mode=${this.types[typeIndex]}&page=${this.pages[typeIndex]}&date=${format(new Date())}`).pipe(map(it => plainToClass(AutoCollectPick, it.data))).toPromise()
    this.pages[typeIndex]++
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
  }

  /**
   * 采集上七牛
   */
  async putQiniu() {
    const pixivWork = await this.autoPixivWorkService.getTypeByDownload(0)
    const originalUrlArray = pixivWork.originalUrl.split("/")
    const pictureName = originalUrlArray[originalUrlArray.length - 1]
    const model: any = await this.bucketService.putUrl(pixivWork.originalUrl, "zeongit-pixiv", pictureName)
    if (model.fsize) {
      pixivWork.download = 1
      pixivWork.pixivUse = 1
      await this.use(pixivWork, pictureName)
      this.autoPixivWorkService.save(pixivWork).then()
    }
  }

  private async use(pixivWork: AutoPixivWorkEntity, url: string) {
    //获取pixiv用户信息
    let info: UserInfoEntity
    try {
      const pixivUser = await this.pixivUserService.getByPixivUserId(pixivWork.userId)
      info = await this.userInfoService.get(pixivUser.userInfoId)
    } catch (e) {
      info = await this.initUser(pixivWork.userName ?? "镜花水月")
      await this.pixivUserService.save(
        new PixivUserEntity(info.id!, pixivWork.userId)
      )
    }
    const picture = new PictureEntity(
      info.id!,
      url,
      pixivWork.width,
      pixivWork.height,
      pixivWork.title,
      pixivWork.description)
    picture.createdBy = info.id
    const translateTags = pixivWork.translateTags ?? ""
    if (translateTags) {
      picture.tagList = Array.from(new Set(translateTags.split("|"))).map(it => new TagEntity(info.id!, it))
    }
    await this.pictureService.save(picture, true)
  }

  private async initUser(name: string) {
    let phone = (Math.round(Math.random() * 100))
    while (await this.userService.countByPhone(phone.toString())) {
      phone += (Math.round(Math.random() * 1000))
    }
    const userInfo = await this.userService.signUp(phone.toString(), "123456")
    userInfo.gender = phone % 2 === 0 ? Gender.FEMALE : Gender.MALE
    userInfo.nickname = name
    return this.userInfoService.save(userInfo)
  }
}
