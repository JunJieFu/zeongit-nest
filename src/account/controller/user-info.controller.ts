import { Body, Controller, Get, Inject } from "@nestjs/common"
import { Type } from "class-transformer"
import { JwtAuth } from "../../auth/decorator/jwt-auth.decorator"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { UserInfoService } from "../service/user-info.service"
import { Gender } from "../../data/constant/gender.constant"
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator"
import { UserService } from "../service/user.service"
import { BucketService } from "../../qiniu/service/bucket.service"
import { qiniuConfigType } from "../../qiniu/config"
import { ConfigType } from "@nestjs/config"

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
    private readonly userInfoService: UserInfoService,
    private readonly userService: UserService,
    private readonly bucketService: BucketService,
    @Inject(qiniuConfigType.KEY)
    private qiniuConfig: ConfigType<typeof qiniuConfigType>
  ) {
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

  @JwtAuth()
  @Get("updateAvatar")
 async updateAvatar(@CurrentUser() userInfo: UserInfoEntity,
               @Body("url") url: string) {
    await this.bucketService.move(url, this.qiniuConfig.qiniuAvatarBucket, this.qiniuConfig.qiniuTemporaryBucket)
    if(userInfo.avatar){
      await this.bucketService.move(userInfo.avatar, this.qiniuConfig.qiniuTemporaryBucket, this.qiniuConfig.qiniuAvatarBucket)
    }
    userInfo.avatar = url
    return this.userInfoService.save(userInfo)
  }

  @JwtAuth()
  @Get("updateBackground")
  async updateBackground(@CurrentUser() userInfo: UserInfoEntity,
                         @Body("url") url: string) {
    await this.bucketService.move(url, this.qiniuConfig.qiniuBackgroundBucket, this.qiniuConfig.qiniuTemporaryBucket)
    if(userInfo.avatar){
      await this.bucketService.move(userInfo.avatar, this.qiniuConfig.qiniuTemporaryBucket, this.qiniuConfig.qiniuBackgroundBucket)
    }
    userInfo.avatar = url
    return this.userInfoService.save(userInfo)
  }

  @JwtAuth()
  @Get("getUpdatePasswordDate")
  async getUpdatePasswordDate(@CurrentUser() userInfo: UserInfoEntity) {
    const user = await this.userService.get(userInfo.userId)
    return user.updateDate
  }
}
