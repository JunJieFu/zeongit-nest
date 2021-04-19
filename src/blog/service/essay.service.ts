import { Injectable } from "@nestjs/common"
import { Between, Repository } from "typeorm"
import { EssayEntity } from "../../data/entity/blog/essay.entity"
import { InjectBlog } from "../../data/decorator/inject-blog.decorator"

@Injectable()
export class EssayService {
  constructor(
    @InjectBlog(EssayEntity)
    private readonly essayRepository: Repository<EssayEntity>
  ) {}

  save(essay: EssayEntity) {
    return this.essayRepository.save(essay)
  }

  listOnYear(year: number) {
    return this.essayRepository.find(
      year
        ? {
            where: {
              createDate: Between(
                new Date(year.toString()),
                new Date((year + 1).toString())
              )
            },
            order: {
              createDate: "DESC"
            }
          }
        : {
            order: {
              createDate: "DESC"
            }
          }
    )
  }
}
