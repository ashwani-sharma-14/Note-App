import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { dbConnect } from "./config/dbConnect.js";
import { envConfig } from "./config/env.config.js";
import AuthRouter from "./routes/auth.js";
import noteRouter from "./routes/note.js";
const app = express();

const corsOption = {
  origin: "https://note-app-xi-mocha.vercel.app",
  credentials: true,
};
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({
    message: "Note Taking App",
  });
});
app.use("/auth", AuthRouter);
app.use("/note", noteRouter);
app.listen(envConfig.port, () => {
  dbConnect();
  console.log("Server is running on port", envConfig.port);
});
