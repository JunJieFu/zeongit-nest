import { Module } from "@nestjs/common"
import { AuthModule } from "../auth/auth.module"
import { DataModule } from "../data/data.module"

@Module({
  imports: [DataModule, AuthModule],
  controllers: [],
  providers: [],
  exports: []
})
export class BeautyModule {
}
