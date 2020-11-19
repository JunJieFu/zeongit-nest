import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { AllExceptionsFilter } from "./share/filter/http_exception.filter"
import { AdviceInterceptor } from "./share/interceptor/advice.interceptor"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalInterceptors(new AdviceInterceptor())
  await app.listen(9000)
}

bootstrap()
