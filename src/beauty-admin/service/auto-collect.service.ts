import { HttpService, Inject, Injectable } from "@nestjs/common"
import { Cron } from "@nestjs/schedule"
import { AutoPixivWorkService } from "./auto-pixiv-work.service"
import { BucketService } from "../../qiniu/service/bucket.service"
import { map } from "rxjs/operators"
import { plainToClass } from "class-transformer"
import { AutoCollectPick } from "../vo"
import { addDay, format } from "../../share/uitl/date.util"
import { AutoPixivWorkEntity } from "../../data/entity/beauty-admin/auto-pixiv-work.entity"
import { PictureEntity } from "../../data/entity/beauty/picture.entity"
import { Gender } from "../../data/constant/gender.constant"
import { UserService } from "./user.service"
import { UserInfoService } from "./user-info.service"
import { PixivUserService } from "./pixiv-user.service"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { PixivUserEntity } from "../../data/entity/beauty-admin/pixiv-user.entity"
import { TagEntity } from "../../data/entity/beauty/tag.entity"
import { PictureService } from "./picture.service"
import { ConfigType } from "@nestjs/config";
import { collectConfigType } from "../config";
import * as qs from "qs"
import { RankParamsModel } from "../model/rank-params.model";
import { RankModeConstant } from "../constant/rank-mode.constant";
import { qiniuConfigType } from "../../qiniu/config";

@Injectable()
export class AutoCollectService {
  constructor(
    @Inject(collectConfigType.KEY)
    private collectConfig: ConfigType<typeof collectConfigType>,
    @Inject(qiniuConfigType.KEY)
    private qiniuConfig: ConfigType<typeof qiniuConfigType>,
    private readonly autoPixivWorkService: AutoPixivWorkService,
    private readonly httpService: HttpService,
    private readonly bucketService: BucketService,
    private readonly pixivUserService: PixivUserService,
    private readonly userService: UserService,
    private readonly userInfoService: UserInfoService,
    private readonly pictureService: PictureService
  ) {
  }

  private rankList = [
    new RankParamsModel(RankModeConstant.DAY, format(addDay(new Date(), -2))),
    new RankParamsModel(RankModeConstant.DAY_MALE, format(addDay(new Date(), -2))),
    new RankParamsModel(RankModeConstant.WEEK_ORIGINAL, format(addDay(new Date(), -2)))
  ]

  //整点和30分钟时调用一次，调用采集
  @Cron('0 0,30 * * * *')
  async collect() {
    console.log("collect--------------->" + new Date())
    const vo = await this.getVo()
    for (const item of vo.illusts) {
      if (item.page_count === 1 && item.restrict === 0 && item.total_bookmarks > 500) {
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
        } catch (e) {}
      }
    }
  }

  /**
   * 采集上七牛
   */
  //每5分钟调用一次，抓取第三方图片
  @Cron('0 */5 * * * *')
  async putQiniu() {
    console.log("putQiniu--------------->" + new Date())
    let pixivWork = await this.autoPixivWorkService.getTypeByDownload(0)
    pixivWork.collectAmount++
    pixivWork = await this.autoPixivWorkService.save(pixivWork)
    const originalUrlArray = pixivWork.originalUrl.split("/")
    const pictureName = originalUrlArray[originalUrlArray.length - 1]
    const model: any = await this.bucketService.putUrl(
      pixivWork.originalUrl.replace(this.collectConfig.pixivHost,
        this.collectConfig.proxy)
      , this.qiniuConfig.pictureBucket, pictureName)
    if (model.fsize) {
      pixivWork.download = 1
      pixivWork.pixivUse = 1
      await this.use(pixivWork, pictureName)
      this.autoPixivWorkService.save(pixivWork).then()
    }
  }

  //每天1点调用一次，更新采集条件
  @Cron('0 0 1 * * *')
  toZero() {
    console.log("toZero--------------->" + new Date())
    for (const i in this.rankList) {
      this.rankList[i].page = 1
      this.rankList[i].date = format(addDay(new Date(), -2))
    }
  }

  private async getVo() {
    const rank = this.rankList[Math.floor(Math.random() * this.rankList.length)]
    const vo = await this.httpService.get(
      this.collectConfig.url,
      {
        params: rank,
        paramsSerializer: (params) => qs.stringify(params, {
          arrayFormat: "repeat"
        })
      }
    ).pipe(map(it => plainToClass(AutoCollectPick, it.data))).toPromise()
    rank.page++
    return vo
  }

  private async use(pixivWork: AutoPixivWorkEntity, url: string) {
    //获取pixiv用户信息
    let info: UserInfoEntity
    try {
      const pixivUser = await this.pixivUserService.getByPixivUserId(pixivWork.userId)
      info = await this.userInfoService.get(pixivUser.userInfoId)
    } catch (e) {
      info = await this.initUser(pixivWork.userName, pixivWork.userId)
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
    picture.createDate = pixivWork.pixivCreateDate
    const translateTags = pixivWork.translateTags ?? ""
    if (translateTags) {
      picture.tagList = Array.from(new Set(translateTags.split("|"))).map(it => new TagEntity(info.id!, it))
    }
    await this.pictureService.save(picture, true)
  }

  private async initUser(name: string, id: string) {
    const userInfo = await this.userService.signUp(id.toString(), "123456")
    userInfo.gender = Number(id) % 2 === 0 ? Gender.FEMALE : Gender.MALE
    userInfo.nickname = name
    return this.userInfoService.save(userInfo)
  }
}
