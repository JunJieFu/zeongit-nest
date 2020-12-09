import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm"
import { TagBlackHoleEntity } from "../../data/entity/beauty/tag-black-hole.entity"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { Pageable } from "../../share/model/pageable.model"
import { paginate } from "nestjs-typeorm-paginate"
import { PagingQuery } from "../query/tag-black-hole.query"
import { InjectBeauty } from "../../data/decorator/inject-beauty.decorator"

export class TagBlackHoleService {
  constructor(
    @InjectBeauty(TagBlackHoleEntity)
    private readonly tagBlackHoleRepository: Repository<TagBlackHoleEntity>
  ) {
  }

  count(userInfoId: number, tag: string) {
    return this.tagBlackHoleRepository.count({
      createdBy: userInfoId,
      tag
    })
  }

  save(tag: string, { id: userInfoId }: UserInfoEntity) {
    return this.tagBlackHoleRepository.save(new TagBlackHoleEntity(userInfoId!, tag))
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
      tagBlacklist.push(...(await this.tagBlackHoleRepository.find({
        createdBy: userInfoId
      })).map(it => it.tag))
    }
    return tagBlacklist
  }

  paging(pageable: Pageable, query: PagingQuery) {

    return paginate(
      this.tagBlackHoleRepository, {
        page: pageable.page,
        limit: pageable.limit
      }, {
        where: this.getQuery(query),
        order: Object.fromEntries(pageable.sort.map(it => [it.key, it.order]))
      })
  }

  private getQuery(query: PagingQuery) {
    const where = {} as Record<keyof TagBlackHoleEntity, any>
    where.createdBy = query.userInfoId
    if (typeof query.startDate !== "undefined" && typeof query.endDate !== "undefined") {
      where.createDate = Between(query.startDate, query.endDate)
    } else {
      if (typeof query.startDate !== "undefined") {
        where.createDate = MoreThanOrEqual(query.startDate)
      }
      if (typeof query.endDate !== "undefined") {
        where.createDate = LessThanOrEqual(query.endDate)
      }
    }
    return where
  }
}
