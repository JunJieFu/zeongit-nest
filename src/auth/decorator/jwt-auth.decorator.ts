import { UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

export const JwtAuthDecorator = () => UseGuards(AuthGuard("jwt"))
