import { Controller, Get } from "@nestjs/common"
import { UserInfoCache } from "../../data/cache/user-info.cache"
import { mergeMap } from "rxjs/operators"

@Controller()
export class AppController {
  constructor(
    private readonly  userInfoCache: UserInfoCache
  ) {
  }

  @Get()
  get() {
    return "Hello"
  }

  @Get("save")
  save() {
    return this.userInfoCache.get(1).pipe(
      mergeMap(userInfo => this.userInfoCache.save(userInfo)))
  }
}
