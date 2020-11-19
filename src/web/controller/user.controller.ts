import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "../../auth/service/auth.service"
import { IsString } from "class-validator"


class SignUpDto {
  @IsString()
  phone!: string
  @IsString()
  password!: string
}

@Controller("user")
export class UserController {
  constructor(private readonly authService: AuthService) {
  }

  @Post("signIn")
  sendCode(@Body() dto: SignUpDto): Promise<string> {
    return this.authService.signIn(dto.phone, dto.password)
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
}
