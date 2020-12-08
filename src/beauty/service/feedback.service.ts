import { Repository } from "typeorm"
import { Injectable } from "@nestjs/common"
import { FeedbackEntity } from "../../data/entity/beauty/feedback.entity"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { InjectBeauty } from "../../data/decorator/inject-beauty.decorator"

@Injectable()
export class FeedbackService {
  constructor(
    @InjectBeauty(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>
  ) {
  }

  save(content: string, email?: string, userInfo?: UserInfoEntity) {
    return this.feedbackRepository.save(new FeedbackEntity(content, email, userInfo?.id))
  }
}
