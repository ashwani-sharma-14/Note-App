import { Request, Response } from "express";
import { Note } from "../model/note";

export const createNote = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "unauthorized" });
    const { title, description } = req.body;
    if (!title || !description)
      return res
        .status(400)
        .json({ message: "title and description required" });

    const note = await Note.create({
      user: req.user.userId,
      title,
      description,
    });
    return res.status(201).json(note);
  } catch (err) {
    return res.status(500).json({ message: "server error", error: err });
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "unauthorized" });
    const notes = await Note.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });
    return res.json(notes);
  } catch (err) {
    return res.status(500).json({ message: "server error", error: err });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "unauthorized" });
    const { id } = req.params;
    const note = await Note.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });
    if (!note) return res.status(404).json({ message: "note not found" });
    return res.json({ message: "deleted" });
  } catch (err) {
    return res.status(500).json({ message: "server error", error: err });
  }
};
