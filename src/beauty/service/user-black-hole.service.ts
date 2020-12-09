import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm"
import { UserBlackHoleEntity } from "../../data/entity/beauty/user-black-hole.entity"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { Pageable } from "../../share/model/pageable.model"
import { PagingQuery } from "../query/picture-black-hole.query"
import { paginate } from "nestjs-typeorm-paginate"
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
      userBlacklist.push(...(await this.userBlackHoleRepository.find({
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
    const where = {} as Record<keyof UserBlackHoleEntity, any>
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
