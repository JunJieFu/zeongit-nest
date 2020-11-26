import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "../../auth/service/auth.service"
import { IsEnum, IsString } from "class-validator"
import { CodeTypeConstant } from "../constant/code-type.constant"
import { UserService } from "../service/user.service"
import { VerificationCodeCache } from "../cache/verification-code.cache"
import { mergeMap } from "rxjs/operators"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { UserInfoEntity } from "../../data/entity/user-info.entity"

class SendCodeDto {
  @IsString()
  phone!: string

  @IsEnum(CodeTypeConstant)
  type!: CodeTypeConstant
}

class SignUpDto {
  @IsString()
  phone!: string
  @IsString()
  code!: string
  @IsString()
  password!: string
}

class SignInDto {
  @IsString()
  phone!: string
  @IsString()
  password!: string
}

class ForgotDto {
  @IsString()
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
  signUp(@Body() { phone, password, code }: SignUpDto) {
    this.userService.validator(phone, CodeTypeConstant.SIGN_UP, code).pipe(mergeMap(() =>
      this.authService.signUp(phone, password)
    ))
  }

  @Post("signIn")
  signIn(@Body() { phone, password }: SignInDto) {
    return this.authService.signIn(phone, password)
  }

  @Post("forgot")
  forgot(@Body() { phone, password, code }: ForgotDto) {
    this.userService.validator(phone, CodeTypeConstant.FORGOT, code).pipe(mergeMap(() =>
      this.authService.forgot(phone, password)
    ))
  }

  @Post("update")
  update(@CurrentUser() info: UserInfoEntity, @Body() { password }: UpdateDto) {
    this.userService.get(info.userId).pipe(mergeMap(user => {
      user.password = password
      return this.userService.save(user)
    }))
  }

  // @JwtAuth()
  // @Post("getByPhone")
  // getByPhone():
  //   NestResponse<any> {
  //   return this.userService.getByPhone("123")
  // }
}
