import { Injectable } from "@nestjs/common"
import { CollectState } from "../../data/constant/collect-state.constant"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { CollectionEntity } from "../../data/entity/beauty/collection.entity"


@Injectable()
export class CollectionService {

  constructor(
    @InjectRepository(CollectionEntity)
    private readonly collectionRepository: Repository<CollectionEntity>
  ) {
  }

  async getCollectState(pictureId: number, userInfoId?: number) {
    if (userInfoId == null) {
      return CollectState.STRANGE
    } else {
      return (await this.collectionRepository.count({
        pictureId,
        createdBy: userInfoId
      })) ? CollectState.CONCERNED : CollectState.STRANGE
    }
  }
}
