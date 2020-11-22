import { CACHE_MANAGER, CacheInterceptor, CacheStore, Controller, Get, Inject, UseInterceptors } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { AuthService } from "../../auth/service/auth.service"

@Controller()
export class AppController {
  constructor(
    private readonly  configService: ConfigService,
    private readonly  authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore) {
  }

  @Get()
  async get() {
    return this.authService.test()
  }

  @Get("/test")
  @UseInterceptors(CacheInterceptor)
  test() {
    return this.configService.get("SECRET_KEY")
  }
}
