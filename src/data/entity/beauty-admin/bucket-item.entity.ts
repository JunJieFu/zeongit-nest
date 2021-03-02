import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("bucket-item")
export class BucketItemEntity {
  @PrimaryGeneratedColumn({name: "id"})
  id?: number
  @Column({name: "key", unique: true})
  key: string

  constructor(
    key: string,
  ) {
    this.key = key
  }
}
