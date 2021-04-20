import { CurrentUser } from "@/auth/decorator/current-user.decorator"
import { JwtAuth } from "@/auth/decorator/jwt-auth.decorator"
import { UserInfoEntity } from "@/data/entity/account/user-info.entity"
import { Body, Controller, Post } from "@nestjs/common"
import { Type } from "class-transformer"
import { IsInt, IsString } from "class-validator"
import { ComplaintService } from "../service/complaint.service"

class SaveDto {
  @Type(() => Number)
  @IsInt()
  pictureId!: number

  @IsString()
  content!: string
}

@Controller("complaint")
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @JwtAuth()
  @Post("save")
  async save(
    @CurrentUser() userInfo: UserInfoEntity,
    @Body() { pictureId, content }: SaveDto
  ) {
    return this.complaintService.save(userInfo, pictureId, content)
  }
}
