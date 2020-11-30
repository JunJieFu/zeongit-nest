import { Injectable } from "@nestjs/common"
import { of } from "rxjs"
import { CollectState } from "../../data/constant/collect-state.constant"


@Injectable()
export class CollectionService {

  exists(pictureId: number, userInfoId?: number) {
    if (userInfoId == null) {
      return of(CollectState.STRANGE)
    } else {
      //TODO
      return of(CollectState.STRANGE)
    }
  }
}
