import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm"
import { UserBlackHoleEntity } from "../../data/entity/beauty/user-black-hole.entity"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { Pageable } from "../../share/model/pageable.model"
import { PagingQuery } from "../query/picture-black-hole.query"
import { paginate } from "nestjs-typeorm-paginate"
import { FootprintEntity } from "../../data/entity/beauty/footprint.entity"
import { InjectBeauty } from "../../data/decorator/inject-beauty.decorator"

export class UserBlackHoleService {
  constructor(
    @InjectBeauty(UserBlackHoleEntity)
    private readonly userBlackHoleRepository: Repository<UserBlackHoleEntity>
  ) {
  }

  count(userInfoId: number, targetId: number) {
    return this.userBlackHoleRepository.count({
      createdBy: userInfoId,
      targetId
    })
  }

  save(targetId: number, { id: userInfoId }: UserInfoEntity) {
    return this.userBlackHoleRepository.save(new UserBlackHoleEntity(userInfoId!, targetId))
  }

  remove(targetId: number, { id: userInfoId }: UserInfoEntity) {
    return this.userBlackHoleRepository.delete({
      createdBy: userInfoId,
      targetId
    })
  }

  async listBlacklist(userInfoId?: number) {
    const userBlacklist: number[] = []
    if (userInfoId) {
      userBlacklist.push.apply(null, (await this.userBlackHoleRepository.find({
        createdBy: userInfoId
      })).map(it => it.targetId))
    }
    return userBlacklist
  }

  paging(pageable: Pageable, query: PagingQuery) {
    return paginate(
      this.userBlackHoleRepository, {
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
