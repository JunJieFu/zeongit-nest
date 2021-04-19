import { RankModeConstant } from "../constant/rank-mode.constant"

export class RankParamsModel {
  type = "rank"
  mode: RankModeConstant
  page = 1
  date: string

  constructor(mode: RankModeConstant, date: string) {
    this.mode = mode
    this.date = date
  }
}
