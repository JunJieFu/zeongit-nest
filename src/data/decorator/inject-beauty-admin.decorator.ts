import { InjectRepository } from "@nestjs/typeorm"
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type"
import { BEAUTY_ADMIN_CONNECTION_NAME } from "../config"

export const InjectBeautyAdmin = (entity: EntityClassOrSchema) => InjectRepository(entity, BEAUTY_ADMIN_CONNECTION_NAME)
