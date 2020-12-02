import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Injectable } from "@nestjs/common"
import { ComplaintEntity } from "../../data/entity/beauty/complaint.entity"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"


@Injectable()
export class ComplaintService {
  constructor(
    @InjectRepository(ComplaintEntity)
    private readonly complaintRepository: Repository<ComplaintEntity>
  ) {
  }

  save(userInfo: UserInfoEntity, pictureId: number, content: string) {
    return this.complaintRepository.save(new ComplaintEntity(userInfo.id!, pictureId, content))
  }
}
