import { Controller, Get, Query } from "@nestjs/common"
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from "class-validator"
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

class PagingDto {
  @IsString()
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


@Controller("picture")
export class PictureController extends PictureVoAbstract {
  constructor(private readonly userBlackHoleService: UserBlackHoleService,
              private readonly pictureBlackHoleService: PictureBlackHoleService,
              private readonly tagBlackHoleService: TagBlackHoleService,
              readonly collectionService: CollectionService,
              readonly userInfoService: UserInfoService,
              readonly pictureDocumentService: PictureDocumentService,
              readonly followService: FollowService
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


  private async getPageVo(page: Pagination<PictureDocument>, userInfoId?: number) {
    const voList = []
    for (const pictureDocument of page.items) {
      voList.push(await this.getPictureVo(pictureDocument, userInfoId))
    }
    return new Pagination(voList, page.meta, page.links)
  }
}
