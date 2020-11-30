import { Controller, Get, Req } from "@nestjs/common"
import { UserInfoCache } from "../../data/cache/user-info.cache"
import { mergeMap } from "rxjs/operators"
import { UserService } from "../service/user.service"

@Controller()
export class AppController {
  constructor(
    private readonly  userInfoCache: UserInfoCache,
    private readonly  userService: UserService
  ) {
  }

  @Get()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get(@Req() req: any) {
    return this.userService.paginate({
      limit: 2,
      page: 1
    })
  }

  @Get("save")
  save() {
    return this.userInfoCache.get(1).pipe(
      mergeMap(userInfo => this.userInfoCache.save(userInfo)))
  }
}
