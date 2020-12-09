import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm"
import { PictureBlackHoleEntity } from "../../data/entity/beauty/picture-black-hole.entity"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { Pageable } from "../../share/model/pageable.model"
import { PagingQuery } from "../query/picture-black-hole.query"
import { paginate } from "nestjs-typeorm-paginate"
import { InjectBeauty } from "../../data/decorator/inject-beauty.decorator"

export class PictureBlackHoleService {
  constructor(
    @InjectBeauty(PictureBlackHoleEntity)
    private readonly pictureBlackHoleRepository: Repository<PictureBlackHoleEntity>
  ) {
  }

  count(userInfoId: number, targetId: number) {
    return this.pictureBlackHoleRepository.count({
      createdBy: userInfoId,
      targetId
    })
  }

  save(targetId: number, { id: userInfoId }: UserInfoEntity) {
    return this.pictureBlackHoleRepository.save(new PictureBlackHoleEntity(userInfoId!, targetId))
  }

  remove(targetId: number, { id: userInfoId }: UserInfoEntity) {
    return this.pictureBlackHoleRepository.delete({
      createdBy: userInfoId,
      targetId
    })
  }

  paging(pageable: Pageable, query: PagingQuery) {
    return paginate(
      this.pictureBlackHoleRepository, {
        page: pageable.page,
        limit: pageable.limit
      }, {
        where: this.getQuery(query),
        order: Object.fromEntries(pageable.sort.map(it => [it.key, it.order]))
      })
  }

  async listBlacklist(userInfoId?: number) {
    const userBlacklist: number[] = []
    if (userInfoId) {
      userBlacklist.push(...(await this.pictureBlackHoleRepository.find({
        createdBy: userInfoId
      })).map(it => it.targetId))
    }
    return userBlacklist
  }

  private getQuery(query: PagingQuery) {
    const where = {} as Record<keyof PictureBlackHoleEntity, any>
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
