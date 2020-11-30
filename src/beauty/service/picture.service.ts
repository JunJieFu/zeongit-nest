import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { PictureEntity } from "../../data/entity/beauty/picture.entity"

export class PictureService {
  constructor(
    @InjectRepository(PictureEntity)
    private readonly pictureRepository: Repository<PictureEntity>
  ) {
  }

}
