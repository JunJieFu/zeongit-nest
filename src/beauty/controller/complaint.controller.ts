import { Body, Controller, Post } from "@nestjs/common"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { JwtAuth } from "../../auth/decorator/jwt-auth.decorator"
import { IsInt, IsString } from "class-validator"
import { ComplaintService } from "../service/complaint.service"
import { Type } from "class-transformer"

class SaveDto {
  @Type(()=>Number)
  @IsInt()
  pictureId!: number

  @IsString()
  content!: string
}


@Controller("complaint")
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {
  }


  @JwtAuth()
  @Post("save")
  async save(@CurrentUser() userInfo: UserInfoEntity, @Body() { pictureId, content }: SaveDto) {
    return this.complaintService.save(userInfo, pictureId, content)
  }
}
