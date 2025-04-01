import express, { Response } from "express"
import {
  createTodo,
  fetchAllTodos,
  fetchTodoById,
} from "../controller/todoController"

const router = express.Router()

//General middleware for all requests, parses json string to js string
router.use(express.json())

// Example query string params used as http://localhost:3000/todos?filter=mat&sort=asc if mat is desired filter and sorted ascending
router.get("/", fetchAllTodos)

// Example path params used as http://localhost:3000/todos/197 if desired id is 197
router.get("/:id", fetchTodoById)

// Post new todo
router.post("/", /* middleware would be put here*/ createTodo)

export default router
