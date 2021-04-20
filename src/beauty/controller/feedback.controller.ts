import { CurrentUser } from "@/auth/decorator/current-user.decorator"
import { UserInfoEntity } from "@/data/entity/account/user-info.entity"
import { Body, Controller, Post } from "@nestjs/common"
import { IsEmail, IsOptional, IsString } from "class-validator"
import { FeedbackService } from "../service/feedback.service"

class SaveDto {
  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  content!: string
}

@Controller("feedback")
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post("save")
  async save(
    @CurrentUser() userInfo: UserInfoEntity | undefined,
    @Body() { email, content }: SaveDto
  ) {
    return this.feedbackService.save(content, email, userInfo)
  }
}
