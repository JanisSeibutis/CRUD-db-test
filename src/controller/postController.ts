import { Request, Response } from "express"
import { Posts } from "../models/Posts"
import { RequestHandler } from "express-serve-static-core"
import { db } from "../config/db"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { IPost } from "../models/IPost"
import { ICommentDBRes } from "../models/ICommentDBRes"

export const fetchAllPosts = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<IPost[]>(`SELECT * FROM posts`)
    res.json(rows)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }
}

export const fetchPostById = async (req: Request, res: Response) => {
  const id = req.params.id
  // const post = posts.find((p) => p.id === +id)

  // res.json(post)
  try {
    const sql = `SELECT 
    posts.id AS post_id,
    posts.content AS post_content,
    posts.author AS posts_author,
    posts.created_at AS post_created_at,
    comments.id AS comment_id,
    comments.content AS comment_content,
    comments.author AS comment_author,
    comments.created_at AS comment_created_at,
    comments.updated_at AS comment_updated_at
    FROM posts.posts
    LEFT JOIN posts.comments ON posts.id = comments.post_id
    WHERE posts.id = ?
    `

    const [rows] = await db.query<ICommentDBRes[]>(sql, [id])
    const post = rows[0]
    res.json(formatDBRes(rows))
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }
}

const formatDBRes = (rows: ICommentDBRes[]) => ({
  id: rows[0].post_id,
  content: rows[0].post_content,
  author: rows[0].post_author,
  created_at: rows[0].post_created_at,
  comment: rows.map((row) => ({
    id: row.comment_id,
    content: row.comment_content,
    author: row.comment_author,
    created_at: row.comment_created_at,
    updated_at: row.comment_updated_at,
  })),
})

export const createPost = async (req: Request, res: Response) => {
  const { title, content, author } = req.body // Destructured object
  // const title = req.body.title
  // const content = req.body.content
  // const author = req.body.author

  if (!title || !content || !author) {
    res.json({ error: "Content is missing" })
    return
  }

  try {
    const sql = `INSERT INTO posts (title, content, author) VALUES (?, ?, ?)`
    const values = [title, content, author]
    const [result] = await db.query<ResultSetHeader>(sql, values)
    res.status(201).json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }

  // const newPost = new Posts(title, content, author)
  // posts.push(newPost)

  // res.status(201).json({ message: "Sucess", data: newPost })
}

export const updatePostById = async (req: Request, res: Response) => {
  const { title, content, author } = req.body // Destructured object

  if (!title || !content || !author) {
    res.status(400).json({ error: "Title,content and author are required" })
    return
  }

  // const postToDelete = posts.find((post) => {
  //   return post.id === parseInt(req.params.id)
  // })

  // if (!postToDelete) {
  //   res.status(404).json({ error: "Post not found" })
  //   return
  // }

  // postToDelete.title = title
  // postToDelete.content = content
  // postToDelete.author = author

  // res.json({ message: "Posts updated", data: postToDelete })

  try {
    const sql = `UPDATE posts SET title = ?, content = ?, author = ? WHERE id = ?`
    const values = [title, content, author, req.params.id]
    const [result] = await db.query<ResultSetHeader>(sql, values)
    res.status(200).json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }
}

export const deletePostById = async (req: Request, res: Response) => {
  const id = req.params.id

  // const postIndex = posts.findIndex((post) => {
  //   return post.id === +id
  // })

  // if (!postIndex) {
  //   res.status(404).json({ error: "Post not found" })
  //   return
  // }

  // posts.splice(postIndex, 1)

  // res.json({ message: "Post deleted" })

  try {
    const sql = `DELETE FROM posts WHERE id = ?`
    const [result] = await db.query<ResultSetHeader>(sql, [id])
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Post not found" })
      return
    }
    res.json({ message: "Post deleted" })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }
}
