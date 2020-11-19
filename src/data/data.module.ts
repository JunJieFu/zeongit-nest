import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "./entity/user.entity"
import { UserInfoEntity } from "./entity/user_info.entity"

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "root",
      database: "zeongit_account_nest",
      entities: [__dirname + "/entity/**/*.entity{.ts,.js}"],
      synchronize: true
    }),
    TypeOrmModule.forFeature([UserEntity, UserInfoEntity])
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule]
})
export class DataModule {}
