import { Injectable } from "@nestjs/common"
import { PictureDocumentRepository } from "../../data/repository/picture-document.repository"
import { nullable } from "../../share/fragment/pipe.function"
import { fromPromise } from "rxjs/internal-compatibility"
import { PictureDocument } from "../../data/document/beauty/picture.document"
import { AspectRatio } from "../../data/constant/aspect-ratio.constant"
import { Pageable } from "../../share/model/pageable.model"
import { PrivacyState } from "../../data/constant/privacy-state.constant"

interface Query {
  userInfoId?: number
  tagList: string[]
  precise: boolean
  name?: string
  startDate?: Date
  endDate?: Date
  aspectRatio?: AspectRatio
  mustUserList?: number[]
  userBlacklist?: number[]
  pictureBlacklist?: number[]
  tagBlacklist?: string[]
}

@Injectable()
export class PictureDocumentService {
  constructor(private readonly pictureDocumentRepository: PictureDocumentRepository) {
  }

  paging(pageable: Pageable, {
    userInfoId,
    tagList = [],
    precise = false,
    name,
    startDate,
    endDate,
    aspectRatio,
    mustUserList = [],
    userBlacklist = [],
    pictureBlacklist = [],
    tagBlacklist = []
  }: Query) {
    let privacy: PrivacyState | undefined = PrivacyState.PUBLIC
    if (mustUserList.length && mustUserList.filter(it => it === userInfoId).length === mustUserList.length) {
      privacy = undefined
    }

    return this.pictureDocumentRepository.paging(pageable, {
      tagList,
      precise,
      name,
      startDate,
      endDate,
      aspectRatio,
      privacy,
      mustUserList,
      userBlacklist,
      pictureBlacklist,
      tagBlacklist
    })
  }

  get(id: number) {
    return fromPromise(this.pictureDocumentRepository.get(id)).pipe(nullable("图片不存在")).toPromise()
  }

  saveLikeAmount(picture: PictureDocument, count: number) {
    picture.likeAmount = count
    return this.pictureDocumentRepository.save(picture)
  }

  saveViewAmount(picture: PictureDocument, count: number) {
    picture.viewAmount = count
    return this.pictureDocumentRepository.save(picture)
  }
}
