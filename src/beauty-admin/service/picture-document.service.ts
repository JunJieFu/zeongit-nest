import { Injectable } from "@nestjs/common"
import { PictureDocumentRepository } from "../../data/repository/picture-document.repository"
import { PictureDocument } from "../../data/document/beauty/picture.document"

@Injectable()
export class PictureDocumentService {
  constructor(
    private readonly pictureDocumentRepository: PictureDocumentRepository
  ) {}
  save(picture: PictureDocument) {
    return this.pictureDocumentRepository.save(picture)
  }
}
