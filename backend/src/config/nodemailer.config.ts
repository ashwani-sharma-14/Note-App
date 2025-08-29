import nodemailer from "nodemailer";
import { envConfig } from "./env.config";



export const transporter = nodemailer.createTransport({
  service: envConfig.mailerService,
  auth: {
    user: envConfig.mailerEmail,
    pass: envConfig.mailerPassword,
  },
});