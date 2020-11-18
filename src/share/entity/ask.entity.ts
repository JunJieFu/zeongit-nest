import { Column } from "typeorm"
import { BaseEntity } from "./base.entity"

export abstract class AskEntity extends BaseEntity {
  @Column({ type: "int", nullable: true })
  createdBy?: number

  protected constructor(createdBy: number) {
    super()
    this.createdBy = createdBy
  }
}
