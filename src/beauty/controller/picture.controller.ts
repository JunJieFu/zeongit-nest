import { Body, Controller, Get, Inject, ParseIntPipe, Post, Query } from "@nestjs/common"
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString } from "class-validator"
import { PictureBlackHoleService } from "../service/picture-black-hole.service"
import { PictureVoAbstract } from "../communal/picture-vo.abstract"
import { CollectionService } from "../service/collection.service"
import { UserInfoService } from "../service/user-info.service"
import { PictureDocumentService } from "../service/picture-document.service"
import { FollowService } from "../service/follow.service"
import { UserBlackHoleService } from "../service/user-black-hole.service"
import { TagBlackHoleService } from "../service/tag-black-hole.service"
import { AspectRatio } from "../../data/constant/aspect-ratio.constant"
import { Transform, Type } from "class-transformer"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { Pageable } from "../../share/model/pageable.model"
import { PageableDefault } from "../../share/decorator/pageable-default.decorator"
import { parseArrayTransformFn } from "../../share/fragment/transform.function"
import { Pagination } from "nestjs-typeorm-paginate"
import { PictureDocument } from "../../data/document/beauty/picture.document"
import { JwtAuth } from "../../auth/decorator/jwt-auth.decorator"
import { qiniuConfigType } from "../../qiniu/config"
import { ConfigType } from "@nestjs/config"
import { BucketService } from "../../qiniu/service/bucket.service"
import { PictureEntity } from "../../data/entity/beauty/picture.entity"
import { PrivacyState } from "../../data/constant/privacy-state.constant"
import { TagEntity } from "../../data/entity/beauty/tag.entity"
import { PictureService } from "../service/picture.service"

class PagingDto {
  @IsString({ each: true })
  @IsOptional()
  @Transform(parseArrayTransformFn)
  tagList!: string[]

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  precise = false

  @IsString()
  @IsOptional()
  name?: string

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date

  @IsEnum(AspectRatio)
  @IsOptional()
  aspectRatio?: AspectRatio
}

class SaveDto {
  @IsString()
  url!: string
  @IsString()
  name!: string
  @IsString()
  introduction!: string
  @IsEnum(PrivacyState)
  privacy!: PrivacyState
  @IsString({ each: true })
  tagList!: string[]
}

class UpdateDto {
  @IsInt()
  id!: number
  @IsString()
  @IsOptional()
  name?: string
  @IsString()
  @IsOptional()
  introduction?: string
  @IsEnum(PrivacyState)
  @IsOptional()
  privacy?: PrivacyState
  @IsString({ each: true })
  @IsOptional()
  tagList?: string[]
}


@Controller("picture")
export class PictureController extends PictureVoAbstract {
  constructor(private readonly userBlackHoleService: UserBlackHoleService,
              private readonly pictureBlackHoleService: PictureBlackHoleService,
              private readonly tagBlackHoleService: TagBlackHoleService,
              readonly collectionService: CollectionService,
              readonly userInfoService: UserInfoService,
              readonly pictureService: PictureService,
              readonly pictureDocumentService: PictureDocumentService,
              readonly followService: FollowService,
              readonly bucketService: BucketService,
              @Inject(qiniuConfigType.KEY)
              private qiniuConfig: ConfigType<typeof qiniuConfigType>
  ) {
    super()
  }

  @Get("paging")
  async paging(@CurrentUser() userInfo: UserInfoEntity | undefined, @PageableDefault() pageable: Pageable, @Query() dto: PagingDto) {
    const page = await this.pictureDocumentService.paging(pageable, {
      userInfoId: userInfo?.id,
      tagList: dto.tagList,
      precise: dto.precise,
      name: dto.name,
      startDate: dto.startDate,
      endDate: dto.endDate,
      aspectRatio: dto.aspectRatio,
      userBlacklist: await this.userBlackHoleService.listBlacklist(userInfo?.id),
      pictureBlacklist: await this.pictureBlackHoleService.listBlacklist(userInfo?.id),
      tagBlacklist: await this.tagBlackHoleService.listBlacklist(userInfo?.id)
    })

    return this.getPageVo(page, userInfo?.id)
  }

  @JwtAuth()
  @Get("pagingByFollowing")
  pagingByFollowing(@CurrentUser() userInfo: UserInfoEntity, @PageableDefault() pageable: Pageable) {
    return this.pictureDocumentService.pagingByFollowing(pageable, userInfo.id!)
  }

  @Get("pagingByRecommend")
  pagingByRecommend(@CurrentUser() userInfo: UserInfoEntity | undefined, @PageableDefault() pageable: Pageable) {
    return this.pictureDocumentService.pagingByRecommend(pageable, userInfo?.id)
  }

  @Get("pagingByRecommendById")
  pagingByRecommendById(@CurrentUser() userInfo: UserInfoEntity | undefined, @PageableDefault() pageable: Pageable, @Query("id", ParseIntPipe) id: number) {
    return this.pictureDocumentService.pagingByRecommendById(pageable, id, userInfo?.id)
  }

  @Get("get")
  get(@CurrentUser() userInfo: UserInfoEntity | undefined, @Query("id", ParseIntPipe) id: number) {
    return this.getPictureVoById(id, userInfo?.id)
  }

  /**
   * 获取tag第一张
   * 会移到ES搜索
   */
  @Get("getFirstByTag")
  async getFirstByTag(@CurrentUser() userInfo: UserInfoEntity | undefined, name: string) {
    return this.getPictureVo(await this.pictureDocumentService.getFirstByTag(name, userInfo?.id), userInfo?.id)
  }


  /**
   * 按tag统计图片
   */
  @Get("countByTag")
  countByTag(name: string) {
    return this.pictureDocumentService.countByTag(name)
  }

  /**
   * 保存图片
   */
  @JwtAuth()
  @Post("save")
  async save(@CurrentUser() userInfo: UserInfoEntity, @Body() dto: SaveDto) {
    await this.bucketService.move(dto.url, this.qiniuConfig.qiniuPictureBucket, this.qiniuConfig.qiniuTemporaryBucket)
    const
      imageInfo = await this.bucketService.getImageInfo(
        dto.url,
        this.qiniuConfig.qiniuPictureBucketUrl
      )
    const
      picture = new PictureEntity(userInfo.id!, dto.url,
        imageInfo.width,
        imageInfo.height,
        dto.name,
        dto.introduction,
        dto.privacy)
    picture.tagList = dto.tagList!.map(it => new TagEntity(userInfo.id!, it))
    return this.getPictureVo(await this.pictureService.save(picture), userInfo.id)
  }

  /**
   * 更新图片
   */
  @JwtAuth()
  @Post("update")
  async update(@CurrentUser() userInfo: UserInfoEntity, @Body() dto: UpdateDto) {
    const picture = await this.pictureService.getSelf(dto.id, userInfo.id!)
    picture.name = dto.name ?? picture.name
    picture.introduction = dto.introduction ?? picture.introduction
    picture.privacy = dto.privacy ?? picture.privacy
    if (dto.tagList) {
      picture.tagList = dto.tagList.map(it => new TagEntity(userInfo.id!, it))
    }
    return this.getPictureVo(await this.pictureService.save(picture), userInfo.id)
  }


  @Post("del")
  async del(@Body("id", ParseIntPipe) id: number) {
    return await this.pictureService.del(id)
  }


  @JwtAuth()
  @Post("hide")
  async hide(@CurrentUser() userInfo: UserInfoEntity, @Body("id", ParseIntPipe) id: number) {
    const picture = await this.pictureService.getSelf(id, userInfo.id!)
    return this.pictureService.hide(picture)
  }


  /**
   * 逻辑删除图片
   */
  @JwtAuth()
  @Post("remove")
  async remove(@CurrentUser() userInfo: UserInfoEntity, @Body("id", ParseIntPipe) id: number) {
    const picture = await this.pictureService.getSelf(id, userInfo.id!)
    return this.pictureService.remove(picture)
  }

  private async getPageVo(page: Pagination<PictureDocument>, userInfoId ?: number
  ) {
    const voList = []
    for (const pictureDocument of page.items) {
      voList.push(await this.getPictureVo(pictureDocument, userInfoId))
    }
    return new Pagination(voList, page.meta, page.links)
  }
}
