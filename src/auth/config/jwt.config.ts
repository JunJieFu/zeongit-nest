import { registerAs } from "@nestjs/config"

export default registerAs("jwt", () => ({
  secretKey: process.env.SECRET_KEY
}))
