import { AskEntity } from "@/share/entity/ask.entity"
import { Column, Entity } from "typeorm"

/**
 * @author fjj
 * @description AskEntity createdBy is followerId 关注人的id
 */
@Entity("follow")
export class FollowEntity extends AskEntity {
  //被关注的人的id
  @Column({ name: "following_id" })
  followingId!: number

  constructor(userInfoId: number, followingId: number) {
    super(userInfoId)
    this.followingId = followingId
  }
}
