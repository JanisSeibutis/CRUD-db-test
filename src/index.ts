import express from "express"
import cors from "cors"
import "dotenv/config"
const app = express()
import { connectToDatabase } from "./config/db"

// Middleware
app.use(express.json()) // This specific middleware parses JSON string to Javascript Object
app.use(cors()) // This makes the Express server except request from other domains

import todoRouter from "./routes/todos"
import postRouter from "./routes/posts"
import subtaskRouter from "./routes/subtasks"

app.use("/todos", todoRouter)
app.use("/posts", postRouter)
app.use("/subtasks", subtaskRouter)

connectToDatabase()

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
