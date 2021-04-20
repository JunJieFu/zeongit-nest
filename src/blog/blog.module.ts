import { DataModule } from "@/data/data.module"
import { Module } from "@nestjs/common"
import { EssayController } from "./controller/essay.controller"
import { MessageController } from "./controller/message.controller"
import { EssayService } from "./service/essay.service"
import { MessageService } from "./service/message.service"

@Module({
  imports: [DataModule],
  controllers: [EssayController, MessageController],
  providers: [EssayService, MessageService],
  exports: []
})
export class BlogModule {}
