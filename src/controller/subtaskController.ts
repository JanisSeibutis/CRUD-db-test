import { Request, Response } from "express"
import { RequestHandler } from "express-serve-static-core"
import { db } from "../config/db"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { ISubtask } from "../models/iSubtask"

// const Subtasks: Subtask[] = [
//   new Subtask("AAA", false),
//   new Subtask("ZZZ", true),
//   new Subtask("Handla mat", true),
//   new Subtask("Käka mat", false),
//   new Subtask("Åka båt", false),
// ]

export const fetchAllSubtasks: RequestHandler = async (
  req: Request,
  res: Response
) => {
  // const filter = req.query.filter
  // const sort = req.query.sort

  // let filteredSubtasks = Subtasks

  // try {
  //   if (filter) {
  //     filteredSubtasks = Subtasks.filter((Subtask) => {
  //       return Subtask.content.includes(filter?.toString() || "")
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
  //     filteredSubtasks = filteredSubtasks.sort((a, b) => {
  //       const Subtask1 = a.id
  //       const Subtask2 = b.id

  //       if (Subtask1 > Subtask2) return 1
  //       if (Subtask1 < Subtask2) return -1
  //       return 0
  //     })
  //   }

  //   if (sort && sort === "desc") {
  //     filteredSubtasks = filteredSubtasks.sort((a, b) => {
  //       const Subtask1 = a.id
  //       const Subtask2 = b.id

  //       if (Subtask1 < Subtask2) return 1
  //       if (Subtask1 > Subtask2) return -1
  //       return 0
  //     })
  //   }
  try {
    const [rows] = await db.query<ISubtask[]>("SELECT * FROM todos.subtasks")
    res.json(rows)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }

  // res.status(200).json(filteredSubtasks)
}

export const fetchSubtaskById = async (req: Request, res: Response) => {
  const id = req.params.id

  // const Subtask = Subtasks.find((t) => {
  //   return t.id === +id // +id === parseInt(id)
  // })

  // res.json({ Subtask })
  const sql = `SELECT * FROM todos.subtasks WHERE id = ?`

  try {
    const [rows] = await db.query<ISubtask[]>(sql, [id])
    const subtask = rows[0]
    if (!subtask) {
      res.status(404).json({ message: "Subtask not found" })
      return
    }
    res.json(subtask)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }
}

export const createSubtask = async (req: Request, res: Response) => {
  const content = req.body.content
  const todo_id = req.body.todo_id

  if (content === undefined) {
    res.json({ error: "Content is required" })
  }

  try {
    const sql = `INSERT INTO todos.subtasks (todo_id, content) VALUES (?, ?)`
    const [result] = await db.query<ResultSetHeader>(sql, [todo_id, content])
    res.status(201).json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }

  res.status(201).json({ message: "Sucess" })
}
