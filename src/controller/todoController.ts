import { Request, Response } from "express"
import { Todo } from "../models/Todo"
import { RequestHandler } from "express-serve-static-core"
import { db } from "../config/db"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { ITodo } from "../models/iTodo"

const todos: Todo[] = [
  new Todo("AAA", false),
  new Todo("ZZZ", true),
  new Todo("Handla mat", true),
  new Todo("Käka mat", false),
  new Todo("Åka båt", false),
]

export const fetchAllTodos: RequestHandler = async (
  req: Request,
  res: Response
) => {
  // const filter = req.query.filter
  // const sort = req.query.sort

  // let filteredTodos = todos

  // try {
  //   if (filter) {
  //     filteredTodos = todos.filter((todo) => {
  //       return todo.content.includes(filter?.toString() || "")
  //     })
  //   }

  //   if (
  //     sort &&
  //     sort.toString() !== "asc" &&
  //     sort &&
  //     sort.toString() !== "desc"
  //   ) {
  //     res.status(400).json({ error: "Sort is not correct" })
  //     return
  //   }

  //   if (sort && sort === "asc") {
  //     filteredTodos = filteredTodos.sort((a, b) => {
  //       const todo1 = a.id
  //       const todo2 = b.id

  //       if (todo1 > todo2) return 1
  //       if (todo1 < todo2) return -1
  //       return 0
  //     })
  //   }

  //   if (sort && sort === "desc") {
  //     filteredTodos = filteredTodos.sort((a, b) => {
  //       const todo1 = a.id
  //       const todo2 = b.id

  //       if (todo1 < todo2) return 1
  //       if (todo1 > todo2) return -1
  //       return 0
  //     })
  //   }
  try {
    const [rows] = await db.query<ITodo[]>("SELECT * FROM todos")
    res.json(rows)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }

  // res.status(200).json(filteredTodos)
}

export const fetchTodoById = async (req: Request, res: Response) => {
  const id = req.params.id

  // const todo = todos.find((t) => {
  //   return t.id === +id // +id === parseInt(id)
  // })

  // res.json({ todo })
  const sql = `SELECT * FROM todos WHERE id = ?`

  try {
    const [rows] = await db.query<ITodo[]>(sql, [id])
    const todo = rows[0]
    if (!todo) {
      res.status(404).json({ message: "Todo not found" })
      return
    }
    res.json(todo)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }
}

export const createTodo = async (req: Request, res: Response) => {
  const content = req.body.content
  if (content === undefined) {
    res.json({ error: "Content is required" })
  }

  try {
    const sql = `INSERT INTO todos (content) VALUES (?)`
    const [result] = await db.query<ResultSetHeader>(sql, [content])
    res.status(200).json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }

  res.status(201).json({ message: "Sucess" })
}
