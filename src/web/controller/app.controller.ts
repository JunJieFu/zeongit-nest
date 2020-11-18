import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { NestResponse } from "../../share/types"
import { AuthService } from "../../auth/service/auth.service"
import { Request } from "express"

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {
  }

  @UseGuards(AuthGuard("local"))
  @Post("login")
  login(@Req() req: Request): NestResponse<any> {
    return this.authService.login(req.user)
  }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  getHello(): NestResponse<string> {
    return "123"
  }
}
