import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "../../auth/service/auth.service"
import { IsEnum, IsOptional, IsString } from "class-validator"
import { CodeTypeConstant } from "../constant/code_type.constant"
import { Expose } from "class-transformer"


class SendCodeDto {
  @IsString()
  @IsOptional()
  phone?: string

  @Expose()
  @IsEnum(CodeTypeConstant)
  type!: CodeTypeConstant
}

class SignUpDto {
  @IsString()
  phone!: string

  #password!: string

  get password() {
    return this.#password
  }

  @IsString()
  set password(value) {
    this.#password = value
  }
}

@Controller("user")
export class UserController {
  constructor(private readonly authService: AuthService) {
  }

  @Post("sendCode")
  sendCode(@Body() dto: SendCodeDto) {
    //TODO
    // return this.authService.signIn(dto.phone, dto.password)
  }

  @Post("signIn")
  signIn(@Body() dto: SignUpDto): Promise<string> {
    return this.authService.signIn(dto.phone, dto.password)
  }

  @Post("signUp")
  signUp(@Body() dto: SignUpDto): Promise<string> {
    return this.authService.signUp(dto.phone, dto.password)
  }

  @Post("test")
  test(@Body() dto: SendCodeDto) {
    return dto.type === CodeTypeConstant.FORGET
  }

  // @Post("getByPhone")
  // getByPhone():
  //   NestResponse<any> {
  //   return this.userService.getByPhone("123")
  // }
}
