import { Injectable } from "@nestjs/common"
import { of } from "rxjs"
import { CollectState } from "../../data/constant/collect-state.constant"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { CollectionEntity } from "../../data/entity/beauty/collection.entity"
import { fromPromise } from "rxjs/internal-compatibility"
import { map } from "rxjs/operators"


@Injectable()
export class CollectionService {

  constructor(
    @InjectRepository(CollectionEntity)
    private readonly collectionRepository: Repository<CollectionEntity>
  ) {
  }

  getCollectState(pictureId: number, userInfoId?: number) {
    if (userInfoId == null) {
      return of(CollectState.STRANGE)
    } else {
      return fromPromise(this.collectionRepository.count({ pictureId, createdBy: userInfoId })).pipe(
        map(
          it => it ? CollectState.CONCERNED : CollectState.STRANGE
        )
      )
    }
  }
}
