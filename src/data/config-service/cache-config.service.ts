import { CacheModuleOptions, CacheOptionsFactory, Injectable } from "@nestjs/common"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const redisStore = require("cache-manager-redis-store")

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    return {
      store: redisStore,
      host: "localhost",
      port: 6379,
      ttl: 100
    }
  }
}
