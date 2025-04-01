import { RowDataPacket } from "mysql2"

export interface ITodo extends RowDataPacket {
  id: number
  content: string
  done: boolean
  created_at: string
}
