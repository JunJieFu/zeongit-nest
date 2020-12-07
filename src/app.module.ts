import { Module } from "@nestjs/common"
import { WebModule } from "./account/web.module"

@Module({
  imports: [ WebModule],
  controllers: [],
  providers: []
})
export class AppModule {
}
