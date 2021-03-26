import { Body, Controller, Get, Post } from "@nestjs/common"
import { IsOptional, IsString } from "class-validator";
import { MessageService } from "../service/message.service";
import { MessageEntity } from "../../data/entity/blog/message.entity";
import { PageableDefault } from "../../share/decorator/pageable-default.decorator";
import { Pageable } from "../../share/model/pageable.model";

class SaveDto {
  @IsString()
  content!: string
  @IsString()
  @IsOptional()
  email?: string
  @IsString()
  @IsOptional()
  name?: string
}

@Controller("message")
export class MessageController {
  constructor(
    private readonly messageService: MessageService
  ) {
  }

  @Post("save")
  save(@Body() dto: SaveDto) {
    return this.messageService.save(
      new MessageEntity(
        dto.content,
        dto.name,
        dto.email
      )
    )
  }

  @Get("paging")
  paging(@PageableDefault() pageable: Pageable,) {
    return this.messageService.paging(pageable)
  }
}
