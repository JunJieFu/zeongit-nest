import { Controller, Get, Query } from "@nestjs/common"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { UserInfoService } from "../service/user-info.service"
import { FollowService } from "../service/follow.service"
import { PictureDocumentService } from "../service/picture-document.service"
import { PictureVoAbstract } from "../communal/picture-vo.abstract"
import { CollectionService } from "../service/collection.service"
import { PictureDocument } from "../../data/document/beauty/picture.document"
import { PageableDefault } from "../../share/decorator/pageable-default.decorator"
import { Pageable } from "../../share/model/pageable.model"
import { Pagination } from "nestjs-typeorm-paginate"
import { PagingQuery } from "../query/works.query"

@Controller("works")
export class WorksController extends PictureVoAbstract {
  constructor(
    readonly collectionService: CollectionService,
    readonly userInfoService: UserInfoService,
    readonly pictureDocumentService: PictureDocumentService,
    readonly followService: FollowService
  ) {
    super()
  }

  @Get("paging")
  async paging(
    @CurrentUser() userInfo: UserInfoEntity | undefined,
    @PageableDefault() pageable: Pageable,
    @Query() query: PagingQuery
  ) {
    const page = await this.pictureDocumentService.paging(pageable, {
      userInfoId: userInfo?.id,
      startDate: query.startDate,
      endDate: query.endDate,
      mustUserList: [query.targetId]
    })
    return this.getPageVo(page, userInfo?.id)
  }

  private async getPageVo(
    page: Pagination<PictureDocument>,
    userInfoId?: number
  ) {
    const voList = []
    for (const pictureDocument of page.items) {
      voList.push(await this.getPictureVo(pictureDocument, userInfoId))
    }
    return new Pagination(voList, page.meta, page.links)
  }
}
