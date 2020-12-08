import { UseGuards } from "@nestjs/common"
import { AuthGuard } from "../strategy/auth.guard"

export const JwtAuth = () => UseGuards(AuthGuard)
