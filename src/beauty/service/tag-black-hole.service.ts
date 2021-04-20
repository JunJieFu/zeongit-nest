import { InjectBeauty } from "@/data/decorator/inject-beauty.decorator"
import { UserInfoEntity } from "@/data/entity/account/user-info.entity"
import { TagBlackHoleEntity } from "@/data/entity/beauty/tag-black-hole.entity"
import { Pageable } from "@/share/model/pageable.model"
import { addDay } from "@/share/uitl/date.util"
import { paginate } from "nestjs-typeorm-paginate"
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm"
import { PagingQuery } from "../query/tag-black-hole.query"

export class TagBlackHoleService {
  constructor(
    @InjectBeauty(TagBlackHoleEntity)
    private readonly tagBlackHoleRepository: Repository<TagBlackHoleEntity>
  ) {}

  count(userInfoId: number, tag: string) {
    return this.tagBlackHoleRepository.count({
      createdBy: userInfoId,
      tag
    })
  }

  save(tag: string, { id: userInfoId }: UserInfoEntity) {
    return this.tagBlackHoleRepository.save(
      new TagBlackHoleEntity(userInfoId!, tag)
    )
  }

  remove(tag: string, { id: userInfoId }: UserInfoEntity) {
    return this.tagBlackHoleRepository.delete({
      createdBy: userInfoId,
      tag
    })
  }

  async listBlacklist(userInfoId?: number) {
    const tagBlacklist: string[] = []
    if (userInfoId) {
      tagBlacklist.push(
        ...(
          await this.tagBlackHoleRepository.find({
            createdBy: userInfoId
          })
        ).map((it) => it.tag)
      )
    }
    return tagBlacklist
  }

  paging(pageable: Pageable, query: PagingQuery) {
    return paginate(
      this.tagBlackHoleRepository,
      {
        page: pageable.page,
        limit: pageable.limit
      },
      {
        where: this.getQuery(query),
        order: Object.fromEntries(
          pageable.sort.map((it) => [it.key, it.order.toUpperCase()])
        )
      }
    )
  }

  private getQuery(query: PagingQuery) {
    const where = {} as Record<keyof TagBlackHoleEntity, any>
    where.createdBy = query.userInfoId
    if (
      typeof query.startDate !== "undefined" &&
      typeof query.endDate !== "undefined"
    ) {
      where.createDate = Between(query.startDate, addDay(query.endDate, 1))
    } else {
      if (typeof query.startDate !== "undefined") {
        where.createDate = MoreThanOrEqual(query.startDate)
      }
      if (typeof query.endDate !== "undefined") {
        where.createDate = LessThanOrEqual(addDay(query.endDate, 1))
      }
    }
    return where
  }
}
