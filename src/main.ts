import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { AllExceptionsFilter } from "./share/filter/http-exception.filter"
import { AdviceInterceptor } from "./share/interceptor/advice.interceptor"
import { ValidationPipe } from "@nestjs/common"
import { NestExpressApplication } from "@nestjs/platform-express"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true
  })
  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalInterceptors(new AdviceInterceptor())
  app.useGlobalPipes(new ValidationPipe({
    transform: true, validateCustomDecorators: true
  }))
  await app.listen(9000)
}

bootstrap()
