import { registerAs } from "@nestjs/config"

export const jwtConfigType = registerAs("jwt", () => ({
  secretKey: process.env.JWT_SECRET_KEY,
  expires: process.env.JWT_EXPIRES
}))

export const authConfigType = registerAs("auth", () => ({
  codeTimeout: parseInt(process.env.AUTH_CODE_TIMEOUT as string)
}))
