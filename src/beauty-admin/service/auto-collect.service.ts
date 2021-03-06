import { Gender } from "@/data/constant/gender.constant"
import { UserInfoEntity } from "@/data/entity/account/user-info.entity"
import { AutoPixivWorkEntity } from "@/data/entity/beauty-admin/auto-pixiv-work.entity"
import { PictureEntity } from "@/data/entity/beauty/picture.entity"
import { TagEntity } from "@/data/entity/beauty/tag.entity"
import { qiniuConfigType } from "@/qiniu/config"
import { BucketService } from "@/qiniu/service/bucket.service"
import { addDay, format } from "@/share/uitl/date.util"
import { HttpService, Inject, Injectable } from "@nestjs/common"
import { ConfigType } from "@nestjs/config"
import { Cron } from "@nestjs/schedule"
import { plainToClass } from "class-transformer"
import * as qs from "qs"
import { map } from "rxjs/operators"
import { QueryFailedError } from "typeorm"
import { collectConfigType } from "../config"
import { RankModeConstant } from "../constant/rank-mode.constant"
import { RankParamsModel } from "../model/rank-params.model"
import { AutoCollect, AutoCollectPick } from "../vo"
import { AutoPixivWorkService } from "./auto-pixiv-work.service"
import { PictureService } from "./picture.service"
import { PixivFollowingService } from "./pixiv-following.service"
import { UserInfoService } from "./user-info.service"
import { UserService } from "./user.service"

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
    private readonly userService: UserService,
    private readonly userInfoService: UserInfoService,
    private readonly pictureService: PictureService,
    private readonly pixivFollowingService: PixivFollowingService
  ) {}

  private rankList = [
    new RankParamsModel(RankModeConstant.DAY, format(addDay(new Date(), -2))),
    new RankParamsModel(
      RankModeConstant.DAY_MALE,
      format(addDay(new Date(), -2))
    ),
    new RankParamsModel(
      RankModeConstant.WEEK_ORIGINAL,
      format(addDay(new Date(), -2))
    )
  ]

  private NO_COLLECTION_TAG_LIST = ["四格", "四格漫画", "漫画", "manga"]

  //整点和30分钟时调用一次，调用采集排行榜
  @Cron("0 0,30 * * * *")
  async collectRank() {
    console.log("collect rank--------------->" + new Date())
    const vo = await this.listRank()
    console.log("collect rank--------------->count: " + vo.illusts.length)
    await this.saveCollect(vo.illusts)
  }

  //整点和30分钟时调用一次，调用采集根据关注者
  @Cron("0 15,45 * * * *")
  async collectByFollowing() {
    console.log("collect by following--------------->" + new Date())
    const vo = await this.listByFollowing()
    console.log("collect rank--------------->count: " + vo.illusts.length)
    await this.saveCollect(vo.illusts)
  }

  /**
   * 采集上七牛
   */
  //每5分钟调用一次，抓取第三方图片
  @Cron("0 */4 * * * *")
  async putQiniu() {
    console.log("putQiniu--------------->" + new Date())
    //获取未下载到七牛的图片
    let pixivWork = await this.getWaitDownloadPixivWork()
    if (pixivWork) {
      console.log("putQiniu--------------->" + pixivWork.id)
      pixivWork.collectAmount++
      pixivWork = await this.autoPixivWorkService.save(pixivWork)
      const originalUrlArray = pixivWork.originalUrl.split("/")
      const pictureName = originalUrlArray[originalUrlArray.length - 1]
      const model: any = await this.bucketService.putUrl(
        pixivWork.originalUrl.replace(
          this.collectConfig.pixivHost,
          this.collectConfig.proxy
        ),
        this.qiniuConfig.pictureBucket,
        pictureName
      )
      if (model.fsize) {
        pixivWork.download = 1
        pixivWork.pixivUse = 1
        await this.use(pixivWork, pictureName)
        this.autoPixivWorkService.save(pixivWork).then()
      }
    } else {
      console.log("putQiniu---------------> not picture")
    }
  }

  //每天1点调用一次，更新采集条件
  @Cron("0 0 1 * * *")
  toZero() {
    console.log("toZero--------------->" + new Date())
    for (const i in this.rankList) {
      this.rankList[i].page = 1
      this.rankList[i].date = format(addDay(new Date(), -2))
    }
  }

  private async listRank() {
    const rank = this.rankList[Math.floor(Math.random() * this.rankList.length)]
    const vo = await this.httpService
      .get(this.collectConfig.url, {
        params: rank,
        paramsSerializer: (params) =>
          qs.stringify(params, {
            arrayFormat: "repeat"
          })
      })
      .pipe(map((it) => plainToClass(AutoCollectPick, it.data)))
      .toPromise()
    rank.page++
    return vo
  }

  private async listByFollowing() {
    const following = await this.pixivFollowingService.get()
    const vo = await this.httpService
      .get(this.collectConfig.url, {
        params: {
          type: "member_illust",
          id: following.userId,
          page: 1
        },
        paramsSerializer: (params) =>
          qs.stringify(params, {
            arrayFormat: "repeat"
          })
      })
      .pipe(map((it) => plainToClass(AutoCollectPick, it.data)))
      .toPromise()
    following.page++
    this.pixivFollowingService.save(following).then()
    return vo
  }

  private async getWaitDownloadPixivWork() {
    for (let i = 0; i < 20; i++) {
      const pixivWork = await this.autoPixivWorkService.getByDownload(0)
      if (pixivWork.collectAmount > 50) return
      const tagList = pixivWork.translateTags?.split("|") ?? []
      //获取两个集合的交集
      const intersection = tagList.filter((it) =>
        this.NO_COLLECTION_TAG_LIST.includes(it)
      )
      //非限制图片并收藏数大于并套图数为1并跟设定的非采集标签交集为空（即不存在非采集标签）
      if (
        pixivWork.xRestrict === 0 &&
        pixivWork.totalBookmarks >= 500 &&
        pixivWork.pageCount === 1 &&
        !intersection.length
      ) {
        return pixivWork
      } else {
        pixivWork.download = 3
        this.autoPixivWorkService.save(pixivWork).then()
      }
    }
  }

  private async saveCollect(illusts: AutoCollect[]) {
    const repeatIdList = []
    for (const item of illusts) {
      try {
        const auto = new AutoPixivWorkEntity()
        auto.pixivId = String(item.id)
        auto.title = item.title
        auto.xRestrict = item.x_restrict
        auto.pixivRestrict = item.restrict
        auto.description = item.caption
        auto.tags = item.tags.map((it) => it.name).join("|")
        auto.translateTags = item.tags
          .map((it) => it.translated_name ?? it.name)
          .join("|")
        auto.userId = String(item.user.id)
        auto.userName = item.user.name
        auto.width = item.width
        auto.height = item.height
        auto.pageCount = item.page_count
        auto.pixivCreateDate = item.create_date
        auto.originalUrl =
          item.meta_single_page.original_image_url ??
          item.meta_pages[0].image_urls.original
        auto.totalView = item.total_view
        auto.totalBookmarks = item.total_bookmarks
        auto.sl = item.sanity_level
        const urlArray = auto.originalUrl.split("/")
        auto.url = urlArray[urlArray.length - 1]
        await this.autoPixivWorkService.save(auto)
      } catch (e) {
        if (e instanceof QueryFailedError) {
          repeatIdList.push(item.id)
        } else {
          console.log(e)
        }
      }
    }
    console.log("repeat id---------------> " + repeatIdList.join(","))
  }

  private async use(pixivWork: AutoPixivWorkEntity, url: string) {
    //获取pixiv用户信息
    let info: UserInfoEntity
    try {
      const user = await this.userService.getByPhone(pixivWork.userId)
      info = await this.userInfoService.getByUserId(user.id!)
    } catch (e) {
      info = await this.initUser(pixivWork.userName, pixivWork.userId)
    }
    const picture = new PictureEntity(
      info.id!,
      url,
      pixivWork.width,
      pixivWork.height,
      pixivWork.title,
      pixivWork.description
    )
    picture.createdBy = info.id
    picture.createDate = pixivWork.pixivCreateDate
    const translateTags = pixivWork.translateTags ?? ""
    if (translateTags) {
      picture.tagList = Array.from(new Set(translateTags.split("|"))).map(
        (it) => new TagEntity(info.id!, it)
      )
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
