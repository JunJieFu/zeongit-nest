import { UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

export const LocalAuthDecorator = () => UseGuards(AuthGuard("local"))
