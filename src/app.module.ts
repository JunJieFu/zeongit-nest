import { Module } from "@nestjs/common"
import { WebModule } from "./web/web.module"

@Module({
  imports: [WebModule],
  controllers: [],
  providers: []
})
export class AppModule {
}
