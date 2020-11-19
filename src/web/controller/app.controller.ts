import { CACHE_MANAGER, CacheInterceptor, CacheStore, Controller, Get, Inject, UseInterceptors } from "@nestjs/common"

@Controller()
export class AppController {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheStore) {
  }

  @Get()
  async get() {
    this.cacheManager.set("a", "1")
    return 1
  }

  @Get("/test")
  @UseInterceptors(CacheInterceptor)
  test() {
    console.log(123)
    return 1
  }
}
