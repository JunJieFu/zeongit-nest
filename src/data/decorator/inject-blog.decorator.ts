import { InjectRepository } from "@nestjs/typeorm"
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type"
import { BLOG_CONNECTION_NAME } from "../config";

export const InjectBlog = (entity: EntityClassOrSchema) => InjectRepository(entity, BLOG_CONNECTION_NAME)
