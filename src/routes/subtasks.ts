import express, { Response } from "express"
import {
  createSubtask,
  fetchAllSubtasks,
  fetchSubtaskById,
} from "../controller/subtaskController"

const router = express.Router()

router.use(express.json())

router.get("/", fetchAllSubtasks)

router.get("/:id", fetchSubtaskById)

router.post("/", createSubtask)

export default router
