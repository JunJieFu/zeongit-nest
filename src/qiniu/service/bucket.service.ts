import { HttpService, Inject, Injectable } from "@nestjs/common"
import { ImageInfo } from "../model/image-info.model"
import { ConfigType } from "@nestjs/config"
import { qiniuConfigType } from "../config"
import { auth, conf, rs } from "qiniu"
import Mac = auth.digest.Mac
import PutPolicy = rs.PutPolicy
import Config = conf.Config
import BucketManager = rs.BucketManager
import { map } from "rxjs/operators"
import { plainToClass } from "class-transformer"

// eslint-disable-next-line @typescript-eslint/no-var-requires


@Injectable()
export class BucketService {
  private readonly mac: Mac
  private readonly bucketManager: BucketManager

  constructor(@Inject(qiniuConfigType.KEY)
              private qiniuConfig: ConfigType<typeof qiniuConfigType>,
              private readonly httpService: HttpService) {
    this.mac = new Mac(this.qiniuConfig.accessKey, this.qiniuConfig.secretKey)
    this.bucketManager = new BucketManager(this.mac, new Config())
  }

  getToken(bucket: string, expires = 7200) {
    const putPolicy = new PutPolicy({scope: bucket, expires})
    return putPolicy.uploadToken(this.mac)
  }

  /**
   * 移动目标
   * @param url 路径
   * @param bucket 目标空间
   * @param sourceBucket 源空间
   */
  async move(url: string, bucket: string, sourceBucket: string) {
    await new Promise((resolve, reject) => {
      this.bucketManager.move(sourceBucket, url, bucket, url, null, (e) => {
        if (e) {
          reject()
        } else {
          resolve()
        }
      })
    })
    return url
  }

  getImageInfo(bucketUrl: string, url: string) {
    // return await new Promise<ImageInfo>((resolve, reject) => {
    //   this.bucketManager.stat(bucket, url, (e, respBody) => {
    //     if (e) {
    //       reject(e)
    //     } else {
    //       resolve(respBody as ImageInfo)
    //     }
    //   })
    // })

    return this.httpService.get(bucketUrl + "/" + url + "?imageInfo").pipe(map(it => plainToClass(ImageInfo, it.data))).toPromise()
  }

  getList(bucket: string, limit = 20, marker?: string): Promise<{ marker: string, items: { key: string }[] }> {
    return new Promise((resolve, reject) => {
      this.bucketManager.listPrefix(bucket, {
        marker,
        limit
      }, (e?: Error, respBody?: { marker: string, items: { key: string }[] }) => {
        if (e) {
          reject(e)
        } else {
          resolve(respBody)
        }
      })
    })
  }

  putUrl(url: string, bucket: string, name: string) {
    return new Promise((resolve, reject) => {
      this.bucketManager.fetch(url, bucket, name, (e, body) => {
        if (e) {
          reject(e)
        } else {
          resolve(body)
        }
      })
    })
  }
}
