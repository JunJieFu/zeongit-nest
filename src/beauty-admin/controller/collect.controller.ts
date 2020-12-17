import { Body, Controller, Get, ParseIntPipe, Post, Query } from "@nestjs/common"
import { PixivUserService } from "../service/pixiv-user.service"
import { PixivWorkService } from "../service/pixiv-work.service"
import { PixivWorkDetailService } from "../service/pixiv-work-detail.service"
import { PixivErrorService } from "../service/pixiv-error.service"
import { NsfwLevelService } from "../service/nsfw-level.service"
import { CollectDto, UpdateOriginalUrlDto } from "../dto"
import { PageableDefault } from "../../share/decorator/pageable-default.decorator"
import { Pageable } from "../../share/model/pageable.model"
import { PixivWorkEntity } from "../../data/entity/beauty-admin/pixiv-work.entity"
import { PixivErrorEntity } from "../../data/entity/beauty-admin/pixiv-error.entity"
import { emojiChange } from "../../share/uitl/emoji.util"
import { PixivWorkDetailEntity } from "../../data/entity/beauty-admin/pixiv-work-detail.entity"
import { imageSize } from "image-size"
import { ProgramException } from "src/share/exception/program.exception"
import { PictureEntity } from "../../data/entity/beauty/picture.entity"
import { PictureService } from "../service/picture.service"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { UserInfoService } from "../service/user-info.service"
import { PixivUserEntity } from "../../data/entity/beauty-admin/pixiv-user.entity"
import { Gender } from "src/data/constant/gender.constant"
import { UserService } from "../service/user.service"
import { TagEntity } from "../../data/entity/beauty/tag.entity"
import { AspectRatio } from "../../data/constant/aspect-ratio.constant"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs")

@Controller("collect")
export class CollectController {
  constructor(
    private readonly pixivUserService: PixivUserService,
    private readonly pixivWorkService: PixivWorkService,
    private readonly pixivWorkDetailService: PixivWorkDetailService,
    private readonly pixivErrorService: PixivErrorService,
    private readonly nsfwLevelService: NsfwLevelService,
    private readonly pictureService: PictureService,
    private readonly userService: UserService,
    private readonly userInfoService: UserInfoService
  ) {
  }

  /**
   * 采集收藏夹到数据库
   * @param dto
   */
  @Post("insert")
  async insert(@Body() dto: CollectDto) {
    for (const work of dto.works ?? []) {
      try {
        let pixivWork: PixivWorkEntity
        try {
          pixivWork = await this.pixivWorkService.getByPixivId(work.id!)
        } catch (e) {
          pixivWork = new PixivWorkEntity()
        }
        pixivWork.illustId = work.illustId
        pixivWork.illustTitle = emojiChange(work.illustTitle ?? "").trim()
        pixivWork.pixivId = work.id
        pixivWork.title = emojiChange(work.title ?? "").trim()
        pixivWork.illustType = work.illustType
        pixivWork.xRestrict = work.xRestrict
        pixivWork.pixivRestrict = work.restrict
        pixivWork.sl = work.sl
        pixivWork.description = emojiChange(work.description ?? "").trim()
        pixivWork.tags = work.tags?.join("|")
        pixivWork.userId = work.userId
        pixivWork.userName = emojiChange(work.userName ?? "").trim()
        pixivWork.width = work.width
        pixivWork.height = work.height
        pixivWork.pageCount = work.pageCount
        pixivWork.bookmarkable = work.isBookmarkable ? 1 : 0
        pixivWork.adContainer = work.isAdContainer ? 1 : 0
        pixivWork.pixivCreateDate = work.createDate
        pixivWork.pixivUpdateDate = work.updateDate
        await this.pixivWorkService.save(pixivWork)
      } catch (e) {
        await this.pixivErrorService.save(new PixivErrorEntity(work.illustId ?? "", "insert--->" + e.message))
        console.error(e.message)
      }
    }
    return true
  }

  @Get("pagingOriginalUrlTask")
  pagingOriginalUrlTask(@PageableDefault() pageable: Pageable) {
    return this.pixivWorkService.pagingOriginalUrlTask(pageable)
  }

  /**
   * 更新原始数据
   */
  @Post("updateOriginalUrl")
  async updateOriginalUrl(@Body() dto: UpdateOriginalUrlDto) {
    try {
      const originalUrl = dto.originalUrl
      const work = await this.pixivWorkService.getByPixivId(dto.pixivId!)
      work.originalUrl = originalUrl
      work.translateTags = dto.translateTags
      work.description = emojiChange(dto.description ?? "").trim()
      if (originalUrl != null && originalUrl.startsWith("https://i.pximg.net/")) {
        const allUrlList: string[] = []
        const proxyUrlList: string[] = []
        for (let i = 0; i < work.pageCount; i++) {
          const originalUrlArray = originalUrl.split("/")
          const pictureName = originalUrlArray[originalUrlArray.length - 1]
          const suitPictureName = pictureName.replace("p0", "p$i")
          const suitUrl = originalUrl.replace(pictureName, suitPictureName)
          await this.pixivWorkDetailService.save(new PixivWorkDetailEntity(
            work.pixivId!,
            suitPictureName,
            suitUrl,
            suitUrl.replace("https://i.pximg.net/",
              "https://pixiv.zeongit.workers.dev/"),
            work.xRestrict,
            work.pixivRestrict
          ))
          allUrlList.push(suitUrl)
          proxyUrlList.push(suitUrl.replace("https://i.pximg.net/",
            "https://pixiv.zeongit.workers.dev/"))
        }
        work.allUrl = allUrlList.join("|")
        work.proxyUrl = proxyUrlList.join("|")
      }
      await this.pixivWorkService.save(work)
    } catch (e) {
      await this.pixivErrorService.save(new PixivErrorEntity(dto.pixivId ?? "", "updateOriginalUrl---->" + e.message))
      console.error(e.message)
    }
    return true
  }

  @Post("checkDownload")
  async checkDownload(@Query("folderPath") folderPath: string) {
    const pixivWorkList = await this.pixivWorkService.listByDownload(0)

    const fileNameList = fs.readdirSync(folderPath) ?? []
    for (const pixivWork of pixivWorkList) {
      pixivWork.download = (fileNameList.filter((it: string) => it.toLowerCase().indexOf(pixivWork.pixivId!) !== -1).length === pixivWork.pageCount) ? 1 : 0
      await this.pixivWorkService.save(pixivWork)
    }
    const pixivWorkDetailList = await this.pixivWorkDetailService.listByDownload(0)
//        val pixivWorkDetailList = pixivWorkDetailService.listByWidth(0)

    for (const pixivWorkDetail of pixivWorkDetailList) {
      pixivWorkDetail.download = fileNameList.toList().contains(pixivWorkDetail.name)
      try {
        if (pixivWorkDetail.download) {
          const read = imageSize(`${folderPath}/${pixivWorkDetail.name}`)
          pixivWorkDetail.width = read.width ?? 0
          pixivWorkDetail.height = read.height ?? 0
          await this.pixivWorkDetailService.save(pixivWorkDetail)
        }
      } catch (e) {
        console.error(e.message)
      }
    }
    return true
  }


  @Post("checkUse")
  async checkUse(@Query("folderPath") folderPath: string, @Query("userInfoId", ParseIntPipe)userInfoId: number) {
    const fileNameList = fs.readdirSync(folderPath) ?? []
    console.log(fileNameList.size)
    for (const fileName in fileNameList) {
      try {
        let pixivWorkDetail: PixivWorkDetailEntity
        //获取pixiv图片详情
        try {
          try {
            pixivWorkDetail = await this.pixivWorkDetailService.getByName(fileName)
          } catch (e) {
            pixivWorkDetail = new PixivWorkDetailEntity(fileName.split("_")[0], fileName, "hide", "hide", 0, 0)
          }
          pixivWorkDetail.using = 1
          await this.pixivWorkDetailService.save(pixivWorkDetail)
        } catch (e) {
          throw new ProgramException("$fileName---------上半部错误")
        }
        //现在数据库获取图片信息，如果没有直接读取图片信息
        let pixivWork: PixivWorkEntity
        try {
          pixivWork = await this.pixivWorkService.getByPixivId(pixivWorkDetail.pixivId!)
        } catch (e) {
          const read = imageSize(`${folderPath}/${fileName}`)
          pixivWork = new PixivWorkEntity()
          pixivWork.width = read.width ?? 0
          pixivWork.height = read.height ?? 0
        }

        //根据url获取正式数据库图片信息
        let picture: PictureEntity
        try {
          picture = await this.pictureService.getByUrl(fileName)
        } catch (e) {
          picture = new PictureEntity(
            userInfoId,
            fileName,
            pixivWorkDetail.width,
            pixivWorkDetail.height,
            pixivWork.title,
            pixivWork.description)
        }
        //获取pixiv用户信息
        let info: UserInfoEntity
        try {
          if (pixivWork.userId) {
            const pixivUser = await this.pixivUserService.getByPixivUserId(pixivWork.userId)
            info = await this.userInfoService.get(pixivUser.userInfoId)
          } else {
            info = await this.userInfoService.get(userInfoId)
          }
        } catch (e) {
          //都失败创建一个用户
          info = await this.initUser(pixivWork.userName ?? "镜花水月")
          if (pixivWork.userId) {
            await this.pixivUserService.save(
              new PixivUserEntity(info.id!, pixivWork.userId)
            )
          }
        }
        picture.createdBy = info.id
        const translateTags = pixivWork.translateTags ?? ""
        if (translateTags) {
          picture.tagList = Array.from(new Set(translateTags.split("|"))).map(it => new TagEntity(info.id!, it))
        }
        await this.pictureService.save(picture, true)
      } catch (e) {
        console.error(fileName)
        console.error(e.message)
      }
    }
    return true
  }


  @Post("checkRestrict")
  async checkRestrict(@Query("sourcePath") sourcePath: string, @Query("folderPath") folderPath: string) {
    const sourcePathList = fs.readdirSync(sourcePath) ?? []
    const list: string[] = []
    for (const path of sourcePathList) {
      let
        detail: PixivWorkDetailEntity
      try {
        detail = await this.pixivWorkDetailService.getByName(path)
      } catch (e) {
        list.push(path)
        continue
      }
      if (detail.xRestrict == 1) {
        fs.renameSync(`${sourcePath}/${path}`, `${folderPath}/${path}`)
      }
    }
    return list
  }

  @Get("toTxt")
  async toTxt() {
    fs.writeFileSync("D:\\my\\图片\\p\\download.txt",
      (await this.pixivWorkDetailService.listByDownload(0)).map(it => it.url).join("\r\n")
    )
    fs.writeFileSync("D:\\my\\图片\\p\\download_proxy.txt",
      (await this.pixivWorkDetailService.listByDownload(0)).map(it => it.proxyUrl).join("\r\n")
    )
  }

  @Post("toTxtAgain")
  async toTxtAgain(sourcePath: string) {
    const sourcePathList = fs.readdirSync(sourcePath) ?? []
    const list: PixivWorkDetailEntity[] = []
    for (const path of sourcePathList) {
      try {
        list.push(await this.pixivWorkDetailService.getByName(path))
      } catch (e) {
      }
    }
    fs.writeFileSync("D:\\my\\图片\\p\\download.txt",
      list.map(it => it.url).join("\r\n")
    )
    fs.writeFileSync("D:\\my\\图片\\p\\download_proxy.txt",
      list.map(it => it.proxyUrl).join("\r\n")
    )
  }

  @Post("checkErrorPicture")
  async checkErrorPicture(folderPath: string) {
    const pictureList = await this.pictureService.list()
    for (const picture of pictureList) {
      if (picture.width === 0 || picture.height === 0) {
        try {
          const read = imageSize(`${folderPath}/${picture.url}`)
          const pixivworkDetail = await this.pixivWorkDetailService.getByName(picture.url)
          pixivworkDetail.height = read.height ?? 0
          pixivworkDetail.width = read.width ?? 0
          picture.height = read.height ?? 0
          picture.width = read.width ?? 0
          if (picture.width > picture.height) {
            picture.aspectRatio = AspectRatio.HORIZONTAL
          } else if (picture.width < picture.height) {
            picture.aspectRatio = AspectRatio.VERTICAL
          } else {
            picture.aspectRatio = AspectRatio.SQUARE
          }
          await this.pixivWorkDetailService.save(pixivworkDetail)
          await this.pictureService.save(picture)
        } catch (e) {
          console.error(e.message)
          console.error(picture.id)
          console.error("--------------------------------")
        }
      }
    }
  }

  @Post("move")
  async move(sourcePath: string, folderPath: string) {
    const list = await this.nsfwLevelService.list()

    for (const nsfwLevel of list) {
      try {
        fs.renameSync(`${sourcePath}/${nsfwLevel.url}`, `${folderPath}/${nsfwLevel.classify}/${nsfwLevel.url}`)
      } catch (e) {
        console.error(e)
      }
    }
    return true
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