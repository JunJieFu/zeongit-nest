import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Injectable } from "@nestjs/common"
import { FeedbackEntity } from "../../data/entity/beauty/feedback.entity"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>
  ) {
  }

  save(content: string, email?: string, userInfo?: UserInfoEntity) {
    return this.feedbackRepository.save(new FeedbackEntity(content, email, userInfo?.id))
  }
}
