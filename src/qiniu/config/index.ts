import { registerAs } from "@nestjs/config"

export const qiniuConfigType = registerAs("qiniu", () => ({
  qiniuAccessKey: "0G397Ly7Z6pqnm2MPUhHIbMFzvBX19yyhu-RdiqI",
  qiniuSecretKey: "_xLtVKJ4VNUrwSsEGkJBHtV2s6mZ2QG2yDXaCvTk",
  qiniuHost: "rs.qiniu.com",
  qiniuTemporaryBucket: "temporary",
  qiniuAvatarBucket: "head",
  qiniuBackgroundBucket: "background",
  qiniuPictureBucket: "secdra",
  qiniuTemporaryBucketUrl: "http://temporary.zeongit.cn",
  qiniuAvatarBucketUrl: "http://avatar.zeongit.cn",
  qiniuBackgroundBucketUrl: "http://background.zeongit.cn",
  qiniuPictureBucketUrl: "http://beauty.picture.zeongit.cn"
}))
