import { Body, Controller, Get, Post } from "@nestjs/common"
import { AuthService } from "../../auth/service/auth.service"
import { IsEnum, IsOptional, IsString } from "class-validator"
import { CodeTypeConstant } from "../constant/code-type.constant"
import { Expose, plainToClass } from "class-transformer"
import { JwtAuth } from "../../auth/decorator/jwt-auth.decorator"
import { UserInfoEntity } from "../../data/entity/user-info.entity"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { UserInfoVo } from "../vo/user-info.vo"


class SendCodeDto {
  @IsString()
  @IsOptional()
  phone?: string

  @Expose()
  @IsEnum(CodeTypeConstant)
  type!: CodeTypeConstant
}

class SignUpDto {
  @Expose()
  @IsString()
  phone!: string
  @Expose()
  @IsString()
  password!: string
}

@Controller("user")
export class UserController {
  constructor(private readonly authService: AuthService) {
  }

  @Post("sendCode")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sendCode(@Body() dto: SendCodeDto) {
    //TODO
    // return this.authService.signIn(dto.phone, dto.password)
  }

  @Post("signIn")
  signIn(@Body() dto: SignUpDto) {
    return this.authService.signIn(dto.phone, dto.password)
  }

  @Post("signUp")
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto.phone, dto.password)
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
