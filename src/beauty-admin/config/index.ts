import { registerAs } from "@nestjs/config"

export const collectConfigType = registerAs("collect", () => ({
  userInfoId: Number(process.env.COLLECT_USER_INFO_ID)!,
  url: process.env.COLLECT_URL!,
  pixivHost: process.env.COLLECT_PIXIV_HOST!,
  proxy: process.env.COLLECT_PROXY!
}))
