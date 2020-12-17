import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("nsfw-level")
export class NsfwLevelEntity {
  @PrimaryGeneratedColumn({ name: "id" })
  id?: number
  @Column({ name: "url", length: 100 })
  url: string

  @Column({ name: "drawings", type: "float" })
  drawings = 0.0

  @Column({ name: "hentai", type: "float" })
  hentai = 0.0

  @Column({ name: "neutral", type: "float" })
  neutral = 0.0

  @Column({ name: "porn", type: "float" })
  porn = 0.0

  @Column({ name: "sexy", type: "float" })
  sexy = 0.0

  @Column({ name: "classify", length: 100 })
  classify: string

  constructor(
    url: string,
    drawings: number,
    hentai: number,
    neutral: number,
    porn: number,
    sexy: number,
    classify: string
  ) {
    this.url = url
    this.drawings = drawings
    this.hentai = hentai
    this.neutral = neutral
    this.porn = porn
    this.sexy = sexy
    this.classify = classify
  }
}
