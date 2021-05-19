export class PictureSuggestDocument {
  tag!: string

  constructor(tag: string) {
    if (tag) {
      this.tag = tag
    }
  }
}
