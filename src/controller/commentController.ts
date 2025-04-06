import { Request, Response } from "express"
import { IComment } from "../models/IComment"
import { RequestHandler } from "express-serve-static-core"
import { db } from "../config/db"
import { ResultSetHeader, RowDataPacket } from "mysql2"

export const fetchAllComments = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<IComment[]>(`SELECT * FROM posts.comments`)
    res.json(rows)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }
}

export const fetchCommentById = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const sql = `SELECT * FROM posts.comments WHERE id = ?`
    const [rows] = await db.query<IComment[]>(sql, [id])
    res.json(rows[0])
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }
}

export const createComment = async (req: Request, res: Response) => {
  const { content, author, post_id } = req.body
  const sql = `INSERT INTO posts.comments (content, author, post_id) VALUES (?, ?, ?)`
  const values = [content, author, post_id]

  try {
    const [result] = await db.query<ResultSetHeader>(sql, values)
    res.status(201).json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }
}

export const UpdateCommentById = async (req: Request, res: Response) => {
  const { content } = req.body
  const id = req.params.id

  const sql = `UPDATE posts.comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`

  const values = [content, id]

  try {
    const [result] = await db.query<ResultSetHeader>(sql, values)
    res.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }
}
