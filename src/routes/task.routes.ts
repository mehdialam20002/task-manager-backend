import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleTask,
} from "../controllers/task.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", createTask);
router.get("/", getTasks);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/toggle", toggleTask);

export default router;
