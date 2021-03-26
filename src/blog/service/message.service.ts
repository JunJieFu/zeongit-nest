import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectBlog } from "../../data/decorator/inject-blog.decorator";
import { Pageable } from "../../share/model/pageable.model";
import { paginate } from "nestjs-typeorm-paginate";
import { MessageEntity } from "../../data/entity/blog/message.entity";

@Injectable()
export class MessageService {
  constructor(
    @InjectBlog(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>) {
  }

  save(message: MessageEntity) {
    return this.messageRepository.save(message)
  }

  paging(pageable: Pageable) {
    return paginate(
      this.messageRepository, {
        page: pageable.page,
        limit: pageable.limit
      }, {
        order: Object.fromEntries(pageable.sort.map(it => [it.key, it.order.toUpperCase()]))
      })
  }
}
