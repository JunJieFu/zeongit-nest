export class Payload {
  id: number
  createdTime: number = Date.now()

  constructor(id: number) {
    this.id = id
  }
}
