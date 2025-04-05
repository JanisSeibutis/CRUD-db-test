import { RowDataPacket } from "mysql2"

export interface ITodoDBRes extends RowDataPacket {
  todo_id: number
  todo_content: string
  todo_done: boolean
  todo_created_at: number
  subtask_id: number
  subtask_content: string
  subtask_done: boolean
  subtask_created_at: number
}
