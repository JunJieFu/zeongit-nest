import { InjectBeauty } from "@/data/decorator/inject-beauty.decorator"
import { UserInfoEntity } from "@/data/entity/account/user-info.entity"
import { ComplaintEntity } from "@/data/entity/beauty/complaint.entity"
import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"

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
