import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "../../auth/service/auth.service"
import { IsEnum, IsOptional, IsString } from "class-validator"
import { CodeTypeConstant } from "../constant/code-type.constant"
import { Expose } from "class-transformer"
import { JwtAuthDecorator } from "../../auth/decorator/jwt-auth.decorator"


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
  signIn(@Body() dto: SignUpDto): Promise<string> {
    return this.authService.signIn(dto.phone, dto.password)
  }

  @Post("signUp")
  signUp(@Body() dto: SignUpDto): Promise<string> {
    return this.authService.signUp(dto.phone, dto.password)
  }

  @JwtAuthDecorator()
  @Post("test")
  test() {
    return 123
  }

  // @JwtAuth()
  // @Post("getByPhone")
  // getByPhone():
  //   NestResponse<any> {
  //   return this.userService.getByPhone("123")
  // }
}
