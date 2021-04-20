import { BlockState } from "@/data/constant/block-state.constant"

export class PictureBlackHoleVo {
  id: number
  state: BlockState
  url?: string
  name?: string

  constructor(id: number, state: BlockState, url?: string, name?: string) {
    this.id = id
    this.state = state
    this.url = url
    this.name = name
  }
}
