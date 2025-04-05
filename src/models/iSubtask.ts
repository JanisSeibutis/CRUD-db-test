import { RowDataPacket } from "mysql2"

export interface ISubtask extends RowDataPacket {
  id: number
  todo_id: number
  content: string
  done: boolean
  created_at: string
}
