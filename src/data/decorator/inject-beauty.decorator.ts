import { InjectRepository } from "@nestjs/typeorm"
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type"
import { BEAUTY_CONNECTION_NAME } from "../config"

export const InjectBeauty = (entity: EntityClassOrSchema) => InjectRepository(entity, BEAUTY_CONNECTION_NAME)
