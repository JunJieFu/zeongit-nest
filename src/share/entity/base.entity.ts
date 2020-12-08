import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm"
import { Type } from "class-transformer"

export abstract class BaseEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id?: number

  @Type(() => Date)
  @CreateDateColumn({ name: "create_date" })
  createDate?: Date

  @Type(() => Date)
  @UpdateDateColumn({ name: "update_date" })
  updateDate?: Date
}
