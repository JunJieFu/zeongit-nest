import { registerAs } from "@nestjs/config"

export const accountConfigType = registerAs("account_database", () => ({
  type: process.env.ACCOUNT_DATABASE_TYPE as "mysql" | "mariadb",
  host: process.env.ACCOUNT_DATABASE_HOST,
  port: parseInt(process.env.ACCOUNT_DATABASE_PORT as string),
  username: process.env.ACCOUNT_DATABASE_USERNAME,
  password: process.env.ACCOUNT_DATABASE_PASSWORD,
  name: process.env.ACCOUNT_DATABASE_NAME
}))

export const cacheConfigType = registerAs("cache", () => ({
  host: process.env.CACHE_HOST,
  port: process.env.CACHE_PORT
}))
