import { Controller, Get } from "@nestjs/common"
import { plainToClass } from "class-transformer"
import { JwtAuth } from "../../auth/decorator/jwt-auth.decorator"
import { UserInfoEntity } from "../../data/entity/user-info.entity"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { UserInfoVo } from "../vo/user-info.vo"
import { UserInfoService } from "../service/user-info.service"


@Controller("userInfo")
export class UserInfoController {
  constructor(
    private readonly userInfoService: UserInfoService) {
  }

  @JwtAuth()
  @Get("get")
  get(@CurrentUser() userInfo: UserInfoEntity) {
    return plainToClass(UserInfoVo, userInfo, { excludeExtraneousValues: true })
  }

  // @JwtAuth()
  // @Post("getByPhone")
  // getByPhone():
  //   NestResponse<any> {
  //   return this.userService.getByPhone("123")
  // }
}
