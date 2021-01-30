import { Controller, Get, Query } from "@nestjs/common"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { UserInfoService } from "../service/user-info.service"
import { UserInfoVoAbstract } from "../communal/user-info-vo.abstract"
import { FollowService } from "../service/follow.service"
import { ProgramException } from "../../share/exception/program.exception"
import { Transform, Type } from "class-transformer"
import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator"
import { UserInfoDocumentService } from "../service/user-info-document.service";
import { parseArrayTransformFn, parseBooleanTransformFn } from "../../share/fragment/transform.function";
import { PageableDefault } from "../../share/decorator/pageable-default.decorator";
import { Pageable } from "../../share/model/pageable.model";
import { Pagination } from "nestjs-typeorm-paginate";
import { UserInfoDocument } from "../../data/document/beauty/user-info.document";

class GetDto {
  @Type(() => Number)
  @IsOptional()
  targetId?: number
}

class PagingDto {
  @IsString({each: true})
  @IsOptional()
  @Transform(parseArrayTransformFn)
  nicknameList!: string[]

  @IsBoolean()
  @IsOptional()
  @Transform(parseBooleanTransformFn)
  precise = false

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date
}

@Controller("userInfo")
export class UserInfoController extends UserInfoVoAbstract {
  constructor(
    readonly userInfoService: UserInfoService,
    readonly followService: FollowService,
    private readonly userInfoDocumentService: UserInfoDocumentService
  ) {
    super()
  }

  @Get("get")
  get(@CurrentUser() userInfo: UserInfoEntity | undefined, @Query() {targetId}: GetDto) {
    if (userInfo || targetId) {
      return this.getUserInfoVoById(targetId ?? userInfo!.id!, userInfo?.id)
    } else {
      throw new ProgramException("请传递参数targetId")
    }
  }

  @Get("paging")
  async paging(@CurrentUser() userInfo: UserInfoEntity | undefined, @PageableDefault() pageable: Pageable, @Query() dto: PagingDto) {
    const page = await this.userInfoDocumentService.paging(pageable, dto)
    return this.getPageVo(page, userInfo?.id)
  }

  @Get("synchronizationIndexPicture")
  synchronizationIndexPicture() {
    return this.userInfoService.synchronizationIndexPicture()
  }

  private async getPageVo(page: Pagination<UserInfoDocument>, userInfoId?: number) {
    const voList = []
    for (const uerInfoDocument of page.items) {
      voList.push(await this.getUserInfoVo(uerInfoDocument, userInfoId))
    }
    return new Pagination(voList, page.meta, page.links)
  }
}
