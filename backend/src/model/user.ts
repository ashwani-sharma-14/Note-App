import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  dob?: Date;
  provider?: "local" | "google";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    dob: { type: Date },
    provider: { type: String, enum: ["local", "google"], default: "local" },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
