import { NestFactory } from "@nestjs/core"
import { AllExceptionsFilter } from "./share/filter/http-exception.filter"
import { AdviceInterceptor } from "./share/interceptor/advice.interceptor"
import { ValidationPipe } from "@nestjs/common"
import { NestExpressApplication } from "@nestjs/platform-express"
import { AccountModule } from "./account/account.module"
import { BeautyModule } from "./beauty/beauty.module"
import { AnalysisGuard } from "./auth/strategy/analysis.guard"
import { jwtConfigType } from "./auth/config"
import { AuthService } from "./auth/service/auth.service"
import { JwtService } from "@nestjs/jwt"
import { BeautyAdminModule } from "./beauty-admin/beauty-admin.module"
import { BlogModule } from "./blog/blog.module";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require("cookie-parser")

async function accountBootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AccountModule, {
    cors: true
  })

  app.use(cookieParser())
  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalGuards(new AnalysisGuard(app.get(jwtConfigType.KEY), app.get(AuthService), app.get(JwtService)))
  app.useGlobalInterceptors(new AdviceInterceptor())
  app.useGlobalPipes(new ValidationPipe({
    transform: true, validateCustomDecorators: true
  }))
  await app.listen(8080)
}

async function beautyBootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(BeautyModule, {
    cors: true
  })
  app.use(cookieParser())
  app.useGlobalGuards(new AnalysisGuard(app.get(jwtConfigType.KEY), app.get(AuthService), app.get(JwtService)))
  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalInterceptors(new AdviceInterceptor())
  app.useGlobalPipes(new ValidationPipe({
    transform: true, validateCustomDecorators: true
  }))
  await app.listen(8081)
}

async function beautyAdminBootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(BeautyAdminModule, {
    cors: true
  })
  app.use(cookieParser())
  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalInterceptors(new AdviceInterceptor())
  app.useGlobalPipes(new ValidationPipe({
    transform: true, validateCustomDecorators: true
  }))
  await app.listen(8082)
}

async function blogBootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(BlogModule, {
    cors: true
  })
  app.use(cookieParser())
  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalInterceptors(new AdviceInterceptor())
  app.useGlobalPipes(new ValidationPipe({
    transform: true, validateCustomDecorators: true
  }))
  await app.listen(9000)
}

accountBootstrap()
beautyBootstrap()
beautyAdminBootstrap()
blogBootstrap()
