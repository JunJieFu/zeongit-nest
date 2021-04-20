import { InjectBeauty } from "@/data/decorator/inject-beauty.decorator"
import { UserInfoEntity } from "@/data/entity/account/user-info.entity"
import { UserBlackHoleEntity } from "@/data/entity/beauty/user-black-hole.entity"
import { Pageable } from "@/share/model/pageable.model"
import { addDay } from "@/share/uitl/date.util"
import { paginate } from "nestjs-typeorm-paginate"
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm"
import { PagingQuery } from "../query/picture-black-hole.query"

export class UserBlackHoleService {
  constructor(
    @InjectBeauty(UserBlackHoleEntity)
    private readonly userBlackHoleRepository: Repository<UserBlackHoleEntity>
  ) {}

  count(userInfoId: number, targetId: number) {
    return this.userBlackHoleRepository.count({
      createdBy: userInfoId,
      targetId
    })
  }

  save(targetId: number, { id: userInfoId }: UserInfoEntity) {
    return this.userBlackHoleRepository.save(
      new UserBlackHoleEntity(userInfoId!, targetId)
    )
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
      userBlacklist.push(
        ...(
          await this.userBlackHoleRepository.find({
            createdBy: userInfoId
          })
        ).map((it) => it.targetId)
      )
    }
    return userBlacklist
  }

  paging(pageable: Pageable, query: PagingQuery) {
    return paginate(
      this.userBlackHoleRepository,
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
    const where = {} as Record<keyof UserBlackHoleEntity, any>
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
