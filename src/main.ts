import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { AllExceptionsFilter } from "./share/filter/http-exception.filter"
import { AdviceInterceptor } from "./share/interceptor/advice.interceptor"
import { ValidationPipe } from "@nestjs/common"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalInterceptors(new AdviceInterceptor())
  app.useGlobalPipes(new ValidationPipe({
    transform: true, validateCustomDecorators: true, transformOptions: { excludeExtraneousValues: true }
  }))
  await app.listen(9000)
}

bootstrap()
