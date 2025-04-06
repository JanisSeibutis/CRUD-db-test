import { query, Request, Response } from "express"
import { Todo } from "../models/Todo"
import { RequestHandler } from "express-serve-static-core"
import { db } from "../config/db"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { ITodo } from "../models/ITodo"
import { ITodoDBRes } from "../models/ITodoDBRes"

export const fetchAllTodos: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { filter, sort } = req.query

  let query = `SELECT * FROM todos.todos`

  const queryParams: string[] = []

  if (filter) {
    query += ` WHERE todos.content LIKE ? COLLATE utf8mb4_general_ci`
    queryParams.push(`%${filter}%`)
  }

  if (sort === "asc" || sort === "desc") {
    query += ` ORDER BY todos.content ${sort.toUpperCase()}`
  }

  try {
    const [rows] = await db.query<ITodoDBRes[]>(query, queryParams)
    res.json(rows)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }
}

export const fetchTodoById = async (req: Request, res: Response) => {
  const id = req.params.id

  // const todo = todos.find((t) => {
  //   return t.id === +id // +id === parseInt(id)
  // })

  // res.json({ todo })
  const sql = `SELECT
  todos.id AS todo_id,
  todos.content AS todo_content,
  todos.done AS todo_done,
  todos.created_at AS todo_created_at,
  subtasks.id AS subtask_id,
  subtasks.content AS subtask_content,
  subtasks.done AS subtask_done,
  subtasks.created_at AS subtask_created_at
  FROM todos.todos
  LEFT JOIN todos.subtasks ON todos.id = subtasks.todo_id 
  WHERE todos.id = ?`
  try {
    const [rows] = await db.query<ITodoDBRes[]>(sql, [id])
    const todo = rows[0]
    if (!todo) {
      res.status(404).json({ message: "Todo not found" })
      return
    }
    res.json(formatTodo(rows))
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }
}

const formatTodo = (rows: ITodoDBRes[]) => ({
  id: rows[0].todo_id,
  content: rows[0].todo_content,
  done: rows[0].todo_done,
  created_at: rows[0].todo_created_at,
  subtasks: rows.map((row) => ({
    id: row.subtask_id,
    content: row.subtask_content,
    done: row.subtask_done,
    created_at: row.subtask_created_at,
  })),
})

export const createTodo = async (req: Request, res: Response) => {
  const content = req.body.content
  if (content === undefined) {
    res.json({ error: "Content is required" })
  }

  try {
    const sql = `INSERT INTO todos.todos (content) VALUES (?)`
    const [result] = await db.query<ResultSetHeader>(sql, [content])
    res.status(201).json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }

  res.status(201).json({ message: "Sucess" })
}
