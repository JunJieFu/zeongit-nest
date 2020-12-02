import { Injectable } from "@nestjs/common"
import { PictureDocumentRepository } from "../../data/repository/picture-document.repository"
import { nullable } from "../../share/fragment/pipe.function"
import { fromPromise } from "rxjs/internal-compatibility"
import { PictureDocument } from "../../data/document/beauty/picture.document"


@Injectable()
export class PictureDocumentService {
  constructor(private readonly pictureDocumentRepository: PictureDocumentRepository) {
  }

  get(id: number) {
    return fromPromise(this.pictureDocumentRepository.get(id)).pipe(nullable("图片不存在")).toPromise()
  }

  saveLikeAmount(picture: PictureDocument, count: number) {
    picture.likeAmount = count
    return this.pictureDocumentRepository.save(picture)
  }
}
