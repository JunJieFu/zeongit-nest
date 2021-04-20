import { PictureDocument } from "@/data/document/beauty/picture.document"
import { PictureDocumentRepository } from "@/data/repository/picture-document.repository"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PictureDocumentService {
  constructor(
    private readonly pictureDocumentRepository: PictureDocumentRepository
  ) {}
  save(picture: PictureDocument) {
    return this.pictureDocumentRepository.save(picture)
  }
}
