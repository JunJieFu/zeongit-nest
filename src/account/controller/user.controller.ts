import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "../../auth/service/auth.service"
import { IsEnum, IsMobilePhone, IsString } from "class-validator"
import { CodeTypeConstant } from "../constant/code-type.constant"
import { UserService } from "../service/user.service"
import { VerificationCodeCache } from "../cache/verification-code.cache"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"

class SendCodeDto {
  @IsString()
  @IsMobilePhone("zh-CN", { strictMode: false }, { message: "请输入正确的手机号码" })
  phone!: string

  @IsEnum(CodeTypeConstant)
  type!: CodeTypeConstant
}

class SignUpDto {
  @IsString()
  @IsMobilePhone("zh-CN", { strictMode: false }, { message: "请输入正确的手机号码" })
  phone!: string
  @IsString()
  code!: string
  @IsString()
  password!: string
}

class SignInDto {
  @IsString()
  @IsMobilePhone("zh-CN", { strictMode: false }, { message: "请输入正确的手机号码" })
  phone!: string
  @IsString()
  password!: string
}

class ForgotDto {
  @IsString()
  @IsMobilePhone("zh-CN", { strictMode: false }, { message: "请输入正确的手机号码" })
  phone!: string
  @IsString()
  code!: string
  @IsString()
  password!: string
}

class UpdateDto {
  @IsString()
  password!: string
}


@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly verificationCodeCache: VerificationCodeCache,
    private readonly authService: AuthService) {
  }

  @Post("sendCode")
  sendCode(@Body() { phone, type }: SendCodeDto) {
    return this.userService.sendCode(phone, type)
  }

  @Post("signUp")
  async signUp(@Body() { phone, password, code }: SignUpDto) {
    await this.userService.validator(phone, CodeTypeConstant.SIGN_UP, code)
    return this.authService.signUp(phone, password)
  }

  @Post("signIn")
  signIn(@Body() { phone, password }: SignInDto) {
    return this.authService.signIn(phone, password)
  }

  @Post("forgot")
  async forgot(@Body() { phone, password, code }: ForgotDto) {
    await this.userService.validator(phone, CodeTypeConstant.FORGOT, code)
    return this.authService.forgot(phone, password)
  }

  @Post("update")
  async update(@CurrentUser() info: UserInfoEntity, @Body() { password }: UpdateDto) {
    const user = await this.userService.get(info.userId)
    user.password = password
    return this.userService.save(user)
  }

  // @JwtAuth()
  // @Post("getByPhone")
  // getByPhone():
  //   NestResponse<any> {
  //   return this.userService.getByPhone("123")
  // }
}
