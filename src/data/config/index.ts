import { registerAs } from "@nestjs/config"

export const accountConfigType = registerAs("account_database", () => ({
  type: process.env.ACCOUNT_DATABASE_TYPE as "mysql" | "mariadb",
  host: process.env.ACCOUNT_DATABASE_HOST,
  port: parseInt(process.env.ACCOUNT_DATABASE_PORT as string),
  username: process.env.ACCOUNT_DATABASE_USERNAME,
  password: process.env.ACCOUNT_DATABASE_PASSWORD,
  name: process.env.ACCOUNT_DATABASE_NAME
}))

export const beautyConfigType = registerAs("beauty_database", () => ({
  type: process.env.BEAUTY_DATABASE_TYPE as "mysql" | "mariadb",
  host: process.env.BEAUTY_DATABASE_HOST,
  port: parseInt(process.env.BEAUTY_DATABASE_PORT as string),
  username: process.env.BEAUTY_DATABASE_USERNAME,
  password: process.env.BEAUTY_DATABASE_PASSWORD,
  name: process.env.BEAUTY_DATABASE_NAME
}))

export const beautyAdminConfigType = registerAs("beauty_admin_database", () => ({
  type: process.env.BEAUTY_ADMIN_DATABASE_TYPE as "mysql" | "mariadb",
  host: process.env.BEAUTY_ADMIN_DATABASE_HOST,
  port: parseInt(process.env.BEAUTY_ADMIN_DATABASE_PORT as string),
  username: process.env.BEAUTY_ADMIN_DATABASE_USERNAME,
  password: process.env.BEAUTY_ADMIN_DATABASE_PASSWORD,
  name: process.env.BEAUTY_ADMIN_DATABASE_NAME
}))


export const cacheConfigType = registerAs("cache", () => ({
  host: process.env.CACHE_HOST,
  port: process.env.CACHE_PORT
}))

export const ACCOUNT_CONNECTION_NAME = "account"
export const BEAUTY_CONNECTION_NAME = "beauty"
export const BEAUTY_ADMIN_CONNECTION_NAME = "beauty_admin"

export const ZEONGIT_BEAUTY_PICTURE = "zeongit_beauty_picture"

export const ZEONGIT_BEAUTY_USER_INFO = "zeongit_beauty_user_info"
