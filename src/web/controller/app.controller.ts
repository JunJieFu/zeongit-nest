import { Controller, Get, Req } from "@nestjs/common"
import { UserInfoCache } from "../../data/cache/user-info.cache"
import { mergeMap } from "rxjs/operators"
import { JwtAuth } from "../../auth/decorator/jwt-auth.decorator"

@Controller()
export class AppController {
  constructor(
    private readonly  userInfoCache: UserInfoCache
  ) {
  }

  @JwtAuth()
  @Get()
  get(@Req() req: any) {
    return "Hello"
  }

  @Get("save")
  save() {
    return this.userInfoCache.get(1).pipe(
      mergeMap(userInfo => this.userInfoCache.save(userInfo)))
  }
}
