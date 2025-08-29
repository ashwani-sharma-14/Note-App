import { Schema, model, Document } from "mongoose";

export interface IOtp extends Document {
  email: string;
  code: number;
  expiresAt: Date;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true },
    code: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Otp = model<IOtp>("Otp", otpSchema);
