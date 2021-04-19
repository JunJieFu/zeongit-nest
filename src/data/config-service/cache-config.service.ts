import {
  CacheModuleOptions,
  CacheOptionsFactory,
  Inject,
  Injectable
} from "@nestjs/common"
import { cacheConfigType } from "../config"
import { ConfigType } from "@nestjs/config"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const redisStore = require("cache-manager-redis-store")

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(
    @Inject(cacheConfigType.KEY)
    private cacheConfig: ConfigType<typeof cacheConfigType>
  ) {}

  createCacheOptions(): CacheModuleOptions {
    return {
      store: redisStore,
      host: this.cacheConfig.host,
      port: this.cacheConfig.port,
      ttl: 100
    }
  }
}
