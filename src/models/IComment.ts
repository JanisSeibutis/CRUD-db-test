import { RowDataPacket } from "mysql2"

export interface IComment extends RowDataPacket {
  id: number
  post_id: number
  content: string
  author: string
  created_at: string
  updated_at: string
}
