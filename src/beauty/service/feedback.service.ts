import { InjectBeauty } from "@/data/decorator/inject-beauty.decorator"
import { UserInfoEntity } from "@/data/entity/account/user-info.entity"
import { FeedbackEntity } from "@/data/entity/beauty/feedback.entity"
import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"

@Injectable()
export class FeedbackService {
  constructor(
    @InjectBeauty(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>
  ) {}

  save(content: string, email?: string, userInfo?: UserInfoEntity) {
    return this.feedbackRepository.save(
      new FeedbackEntity(content, email, userInfo?.id)
    )
  }
}
