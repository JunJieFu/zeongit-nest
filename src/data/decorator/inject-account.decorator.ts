import { InjectRepository } from "@nestjs/typeorm"
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type"
import { ACCOUNT_CONNECTION_NAME } from "../config"

export const InjectAccount = (entity: EntityClassOrSchema) => InjectRepository(entity, ACCOUNT_CONNECTION_NAME)
