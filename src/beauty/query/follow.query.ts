import { IsDate, IsInt, IsOptional } from "class-validator"
import { Type } from "class-transformer"

export class PagingQuery {
  @Type(() => Number)
  @IsInt()
  targetId?: number

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date
}
