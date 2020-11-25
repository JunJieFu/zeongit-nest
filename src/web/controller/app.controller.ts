import { Controller, Get } from "@nestjs/common"
import { UserInfoCache } from "../../data/cache/user-info.cache"
import { mergeMap } from "rxjs/operators"
import { JwtAuth } from "../../auth/decorator/jwt-auth.decorator"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { UserInfoEntity } from "../../data/entity/user-info.entity"

@Controller()
export class AppController {
  constructor(
    private readonly  userInfoCache: UserInfoCache
  ) {
  }

  @JwtAuth()
  @Get()
  get(@CurrentUser() info: UserInfoEntity) {
    return info
  }

  @Get("save")
  save() {
    return this.userInfoCache.get(1).pipe(
      mergeMap(userInfo => this.userInfoCache.save(userInfo)))
  }
}
