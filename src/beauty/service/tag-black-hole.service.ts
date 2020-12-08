import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm"
import { TagBlackHoleEntity } from "../../data/entity/beauty/tag-black-hole.entity"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { Pageable } from "../../share/model/pageable.model"
import { paginate } from "nestjs-typeorm-paginate"
import { PagingQuery } from "../query/tag-black-hole.query"
import { FootprintEntity } from "../../data/entity/beauty/footprint.entity"
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
    const userBlacklist: string[] = []
    if (userInfoId) {
      userBlacklist.push.apply(null, (await this.tagBlackHoleRepository.find({
        createdBy: userInfoId
      })).map(it => it.tag))
    }
    return userBlacklist
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
    const where = {} as Record<keyof FootprintEntity, any>
    where.createdBy = query.userInfoId
    where.createDate = query.startDate ? MoreThanOrEqual(query.startDate) : undefined
    where.createDate = query.endDate ? LessThanOrEqual(query.endDate) : undefined
    return where
  }
}
