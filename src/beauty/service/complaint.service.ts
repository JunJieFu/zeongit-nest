import { Repository } from "typeorm"
import { Injectable } from "@nestjs/common"
import { ComplaintEntity } from "../../data/entity/beauty/complaint.entity"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { InjectBeauty } from "../../data/decorator/inject-beauty.decorator"

@Injectable()
export class ComplaintService {
  constructor(
    @InjectBeauty(ComplaintEntity)
    private readonly complaintRepository: Repository<ComplaintEntity>
  ) {}

  save(userInfo: UserInfoEntity, pictureId: number, content: string) {
    return this.complaintRepository.save(
      new ComplaintEntity(userInfo.id!, pictureId, content)
    )
  }
}
