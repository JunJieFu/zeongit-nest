import { NestFactory } from "@nestjs/core"
import { AllExceptionsFilter } from "./share/filter/http-exception.filter"
import { AdviceInterceptor } from "./share/interceptor/advice.interceptor"
import { ValidationPipe } from "@nestjs/common"
import { NestExpressApplication } from "@nestjs/platform-express"
import { AccountModule } from "./account/account.module"
import { BeautyModule } from "./beauty/beauty.module"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require("cookie-parser")

async function accountBootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AccountModule, {
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

async function beautyBootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(BeautyModule, {
    cors: true
  })
  app.use(cookieParser())
  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalInterceptors(new AdviceInterceptor())
  app.useGlobalPipes(new ValidationPipe({
    transform: true, validateCustomDecorators: true
  }))
  await app.listen(9100)
}

accountBootstrap()
beautyBootstrap()
