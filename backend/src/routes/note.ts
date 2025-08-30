import { Router } from "express";
import {
  createNote,
  getNotes,
  deleteNote,
} from "@/controllers/noteController.js";
import { authenticateToken } from "@/middleware/auth.js";
const noteRouter = Router();

noteRouter.use(authenticateToken);

noteRouter.post("/", createNote);
noteRouter.get("/", getNotes);
noteRouter.delete("/:id", deleteNote);

export default noteRouter;
