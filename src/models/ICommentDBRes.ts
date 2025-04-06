import { RowDataPacket } from "mysql2"

export interface ICommentDBRes extends RowDataPacket {
  post_id: number
  post_content: string
  post_author: string
  post_created_at: number
  comment_id: number
  comment_content: string
  comment_author: string
  comment_created_at: string
  comment_updated_at: string
}
