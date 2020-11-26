import { Body, Controller, Get } from "@nestjs/common"
import { Type } from "class-transformer"
import { JwtAuth } from "../../auth/decorator/jwt-auth.decorator"
import { UserInfoEntity } from "../../data/entity/user-info.entity"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { UserInfoService } from "../service/user-info.service"
import { Gender } from "../../data/constant/gender.constant"
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator"

class UserInfoDto {
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  birthday?: Date

  @IsString()
  @IsOptional()
  nickname?: string

  @IsString()
  @IsOptional()
  introduction?: string

  @IsString()
  @IsOptional()
  country?: string

  @IsString()
  @IsOptional()
  province?: string

  @IsString()
  @IsOptional()
  city?: string
}


@Controller("userInfo")
export class UserInfoController {
  constructor(
    private readonly userInfoService: UserInfoService) {
  }

  @JwtAuth()
  @Get("get")
  get(@CurrentUser() userInfo: UserInfoEntity) {
    return userInfo
  }

  @JwtAuth()
  @Get("save")
  save(@CurrentUser() userInfo: UserInfoEntity,
       @Body(){
         gender,
         birthday,
         nickname,
         introduction,
         country,
         province,
         city
       }: UserInfoDto) {
    userInfo.gender = gender ?? userInfo.gender
    userInfo.birthday = birthday ?? userInfo.birthday
    userInfo.nickname = nickname ?? userInfo.nickname
    userInfo.introduction = introduction ?? userInfo.introduction
    userInfo.country = country ?? userInfo.country
    userInfo.province = province ?? userInfo.province
    userInfo.city = city ?? userInfo.city

    return this.userInfoService.save(userInfo)
  }

// @JwtAuth()
// @Post("getByPhone")
// getByPhone():
//   NestResponse<any> {
//   return this.userService.getByPhone("123")
// }
}
