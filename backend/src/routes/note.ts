import { Router } from "express";
import {
  createNote,
  getNotes,
  deleteNote,
} from "../controllers/noteController";
import { authenticateToken } from "@/middleware/auth";
const noteRouter = Router();

noteRouter.use(authenticateToken);

noteRouter.post("/", createNote);
noteRouter.get("/", getNotes);
noteRouter.delete("/:id", deleteNote);

export default noteRouter;
