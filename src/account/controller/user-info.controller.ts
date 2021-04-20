import { CurrentUser } from "@/auth/decorator/current-user.decorator"
import { JwtAuth } from "@/auth/decorator/jwt-auth.decorator"
import { Gender } from "@/data/constant/gender.constant"
import { UserInfoEntity } from "@/data/entity/account/user-info.entity"
import { qiniuConfigType } from "@/qiniu/config"
import { BucketService } from "@/qiniu/service/bucket.service"
import { Body, Controller, Get, Inject, Post } from "@nestjs/common"
import { ConfigType } from "@nestjs/config"
import { Type } from "class-transformer"
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator"
import { UserInfoService } from "../service/user-info.service"
import { UserService } from "../service/user.service"

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
  ) {}

  @JwtAuth()
  @Get("get")
  get(@CurrentUser() userInfo: UserInfoEntity) {
    return userInfo
  }

  @JwtAuth()
  @Post("save")
  save(
    @CurrentUser() userInfo: UserInfoEntity,
    @Body()
    {
      gender,
      birthday,
      nickname,
      introduction,
      country,
      province,
      city
    }: UserInfoDto
  ) {
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
  async updateAvatar(
    @CurrentUser() userInfo: UserInfoEntity,
    @Body("url") url: string
  ) {
    await this.bucketService.move(
      url,
      this.qiniuConfig.avatarBucket,
      this.qiniuConfig.temporaryBucket
    )
    if (userInfo.avatar) {
      await this.bucketService.move(
        userInfo.avatar,
        this.qiniuConfig.temporaryBucket,
        this.qiniuConfig.avatarBucket
      )
    }
    userInfo.avatar = url
    return this.userInfoService.save(userInfo)
  }

  @JwtAuth()
  @Get("updateBackground")
  async updateBackground(
    @CurrentUser() userInfo: UserInfoEntity,
    @Body("url") url: string
  ) {
    await this.bucketService.move(
      url,
      this.qiniuConfig.backgroundBucket,
      this.qiniuConfig.temporaryBucket
    )
    if (userInfo.avatar) {
      await this.bucketService.move(
        userInfo.avatar,
        this.qiniuConfig.temporaryBucket,
        this.qiniuConfig.backgroundBucket
      )
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
