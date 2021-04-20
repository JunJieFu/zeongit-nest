import { UserInfoDocumentRepository } from "@/data/repository/user-info-document.repository"
import { Pageable } from "@/share/model/pageable.model"
import { addDay } from "@/share/uitl/date.util"
import { Injectable } from "@nestjs/common"

interface Query {
  precise?: boolean
  nicknameList?: string[]
  startDate?: Date
  endDate?: Date
}

@Injectable()
export class UserInfoDocumentService {
  constructor(
    private readonly userInfoDocumentRepository: UserInfoDocumentRepository
  ) {}

  paging(
    pageable: Pageable,
    { precise, nicknameList, startDate, endDate }: Query
  ) {
    return this.userInfoDocumentRepository.paging(
      pageable,
      this.generateQuery({
        nicknameList,
        precise,
        startDate,
        endDate
      })
    )
  }

  private generateQuery({
    precise,
    nicknameList = [],
    startDate,
    endDate
  }: Query) {
    const query: { bool: { must: any[] } } = {
      bool: {
        must: [
          {
            bool: {
              should: nicknameList.map((it) => ({
                [precise ? "term" : "wildcard"]: {
                  nickname: precise ? it : `*${it}*`
                }
              }))
            }
          }
        ]
      }
    }
    query.bool.must.push({
      range: {
        updateDate: {
          gte: startDate,
          lte: endDate ? addDay(endDate, 1) : undefined
        }
      }
    })
    return query
  }
}
