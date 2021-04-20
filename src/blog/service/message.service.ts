import { InjectBlog } from "@/data/decorator/inject-blog.decorator"
import { MessageEntity } from "@/data/entity/blog/message.entity"
import { Pageable } from "@/share/model/pageable.model"
import { Injectable } from "@nestjs/common"
import { paginate } from "nestjs-typeorm-paginate"
import { Repository } from "typeorm"

@Injectable()
export class MessageService {
  constructor(
    @InjectBlog(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>
  ) {}

  save(message: MessageEntity) {
    return this.messageRepository.save(message)
  }

  paging(pageable: Pageable) {
    return paginate(
      this.messageRepository,
      {
        page: pageable.page,
        limit: pageable.limit
      },
      {
        order: Object.fromEntries(
          pageable.sort.map((it) => [it.key, it.order.toUpperCase()])
        )
      }
    )
  }
}
