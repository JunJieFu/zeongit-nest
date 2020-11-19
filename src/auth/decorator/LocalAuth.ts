import { UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

export const LocalAuth = () => UseGuards(AuthGuard("local"))
