import { Request, Response } from "express"
import { Posts } from "../models/Posts"
import { RequestHandler } from "express-serve-static-core"
import { db } from "../config/db"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { IPost } from "../models/iPost"

const posts: Posts[] = [
  new Posts("Greeting", "Wasaaap dawg", "Janis"),
  new Posts("A Book", "Text here", "Good author"),
  new Posts("B Book", "Text here also", "Z Best"),
]

export const fetchAllPosts = async (req: Request, res: Response) => {
  // s

  try {
    const [rows] = await db.query<IPost[]>(`SELECT * FROM posts`)
    res.json(rows)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }

  // res.json(filteredPosts)
}

export const fetchPostById = async (req: Request, res: Response) => {
  const id = req.params.id
  // const post = posts.find((p) => p.id === +id)

  // res.json(post)
  try {
    const sql = `SELECT * FROM posts WHERE id = ?`
    const [rows] = await db.query<IPost[]>(sql, [id])
    const post = rows[0]
    res.json(post)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ error: message })
    return
  }
}

export const createPost = async (req: Request, res: Response) => {
  const { title, content, author } = req.body // Destructured object
  // const title = req.body.title
  // const content = req.body.content
  // const author = req.body.author

  if (!title || !content || !author) {
    res.json({ error: "Content is missing" })
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
