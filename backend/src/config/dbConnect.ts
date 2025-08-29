import mongoose from "mongoose";
import { envConfig } from "./env.config.js";
const dbUrl = envConfig.dbUrl || " ";

export const dbConnect = async () => {
  await mongoose
    .connect(dbUrl)
    .then(() => console.log("connected to db"))
    .catch((err) => console.log(err));
};
