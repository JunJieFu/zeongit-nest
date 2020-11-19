import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { NestResponse } from "../../share/types"
import { AuthService } from "../../auth/service/auth.service"
import { Request } from "express"
import { UserService } from "../service/user.service"
import { UserEntity } from "../../data/entity/user.entity"
import { Pagination } from "nestjs-typeorm-paginate"
import { PageableDefault } from "../../share/decorator/pageable_default.decorator"
import { Pageable } from "../../share/model/pageable.model"

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {
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

  @Get("/test")
  test(@PageableDefault() pageable: Pageable): Promise<Pagination<UserEntity>> {
    console.log(pageable)
    return this.userService.paginate(pageable)
  }
}
