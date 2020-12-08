import { TagFrequencyVo } from "./tag-frequency.vo"

export class TagPictureVo extends TagFrequencyVo {
  url: string

  constructor(name: string, amount: number, url: string) {
    super(name, amount)
    this.url = url
  }
}
