import { LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm"
import { PictureBlackHoleEntity } from "../../data/entity/beauty/picture-black-hole.entity"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { Pageable } from "../../share/model/pageable.model"
import { PagingQuery } from "../query/picture-black-hole.query"
import { paginate } from "nestjs-typeorm-paginate"
import { FootprintEntity } from "../../data/entity/beauty/footprint.entity"
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
    const where = {} as Record<keyof FootprintEntity, any>
    where.createdBy = query.userInfoId
    where.createDate = query.startDate ? MoreThanOrEqual(query.startDate) : undefined
    where.createDate = query.endDate ? LessThanOrEqual(query.endDate) : undefined
    return where
  }
}
