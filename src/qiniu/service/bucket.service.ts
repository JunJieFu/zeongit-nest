import { Injectable } from "@nestjs/common"
import { ImageInfo } from "../model/image-info.model"


@Injectable()
export class BucketService {
  constructor() {
  }

  /**
   * 移动目标
   * @param url 路径
   * @param bucket 目标空间
   * @param sourceBucket 源空间
   */
  move(url: string, bucket: string, sourceBucket: string) {
    console.log(123)
    return url
  }

  async getImageInfo(url: string, bucketUrl: string) {
    return new ImageInfo()
  }
}
