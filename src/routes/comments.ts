import express from "express"
import {
  createComment,
  // deleteCommentById,
  fetchAllComments,
  fetchCommentById,
  UpdateCommentById,
} from "../controller/commentController"

const router = express.Router()

router.use(express.json())

router.get("/", fetchAllComments)

router.get("/:id", fetchCommentById)

router.post("/", createComment)

router.patch("/:id", UpdateCommentById)

// router.delete("/:id", deleteCommentById)

export default router
