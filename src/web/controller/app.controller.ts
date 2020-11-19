import { Body, Controller, Get, Post } from "@nestjs/common"
import { NestResponse } from "../../share/types"
import { AuthService } from "../../auth/service/auth.service"
import { JwtAuth } from "../../auth/decorator/JwtAuth"
import { IsString } from "class-validator"
import { Type } from "class-transformer"
import { CurrentUser } from "../../share/decorator/current_user.decorator"
import { UserInfoEntity } from "../../data/entity/user_info.entity"

class SignUpDto {
  @Type(() => String)
  @IsString()
  phone!: string
  @Type(() => String)
  @IsString()
  password!: string
}

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {
  }

  @Post("signIn")
  signIn(@Body() dto: SignUpDto): Promise<string> {
    return this.authService.signIn(dto.phone, dto.password)
  }

  @Post("signUp")
  signUp(@Body() dto: SignUpDto): Promise<string> {
    return this.authService.signUp(dto.phone, dto.password)
  }

  // @Post("getByPhone")
  // getByPhone():
  //   NestResponse<any> {
  //   return this.userService.getByPhone("123")
  // }

  @JwtAuth()
  @Get()
  getHello(@CurrentUser() info: UserInfoEntity): NestResponse<UserInfoEntity> {
    return info
  }
}
