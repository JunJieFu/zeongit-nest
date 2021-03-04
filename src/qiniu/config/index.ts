import { registerAs } from "@nestjs/config"

export const qiniuConfigType = registerAs("qiniu", () => ({
  accessKey: process.env.QINIU_ACCESS_KEY!,
  secretKey: process.env.QINIU_SECRET_KEY!,
  host: process.env.QINIU_HOST!,
  temporaryBucket: process.env.QINIU_TEMPORARY_BUCKET!,
  avatarBucket: process.env.QINIU_AVATAR_BUCKET!,
  backgroundBucket: process.env.QINIU_BACKGROUND_BUCKET!,
  pictureBucket: process.env.QINIU_PICTURE_BUCKET!,
  collectBucket: process.env.QINIU_COLLECT_BUCKET!,
  temporaryBucketUrl: process.env.QINIU_TEMPORARY_BUCKET_URL!,
  avatarBucketUrl: process.env.QINIU_AVATAR_BUCKET_URL!,
  backgroundBucketUrl: process.env.QINIU_BACKGROUND_BUCKET_URL!,
  pictureBucketUrl: process.env.QINIU_PICTURE_BUCKET_URL!,
  collectBucketUrl: process.env.QINIU_COLLECT_BUCKET_URL!
}))
