import { registerAs } from "@nestjs/config"

export const cacheConfigType = registerAs("cache", () => ({
  host: process.env.CACHE_HOST,
  port: process.env.CACHE_PORT
}))
