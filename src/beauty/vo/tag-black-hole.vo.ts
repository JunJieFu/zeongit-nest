import { BlockState } from "@/data/constant/block-state.constant"

export class TagBlackHoleVo {
  name: string
  state: BlockState

  constructor(name: string, state: BlockState) {
    this.name = name
    this.state = state
  }
}
