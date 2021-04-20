import { BlockState } from "@/data/constant/block-state.constant"

export class UserBlackHoleVo {
  id: number
  state: BlockState
  avatar?: string
  nickname?: string

  constructor(
    id: number,
    state: BlockState,
    avatar?: string,
    nickname?: string
  ) {
    this.id = id
    this.state = state
    this.avatar = avatar
    this.nickname = nickname
  }
}
