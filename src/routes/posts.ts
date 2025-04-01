import express from "express"
import {
  createPost,
  deletePostById,
  fetchAllPosts,
  fetchPostById,
  updatePostById,
} from "../controller/postController"

const router = express.Router()

//General middleware for all requests, parses json string to js string
router.use(express.json())

// Example query string params used as http://localhost:3000?filter=janis&sort=asc if janis is desired filter and sorted ascending
router.get("/", fetchAllPosts)

// Posts id using path params used as http://localhost:3000/197 if desired id is 197
router.get("/:id", fetchPostById)

// Post new post
router.post("/", createPost)

// Update a post by id
router.patch("/:id", updatePostById)

// Delete a post by id
router.delete("/:id", deletePostById)

export default router
