import jwt, { SignOptions } from "jsonwebtoken";
import { setAuthCookie } from "./cookies";
import { envConfig } from "@/config/env.config";
import { Response } from "express";

const accessTokenSecret = envConfig.jwtSecret as string;
const accessTokenExpiry: SignOptions["expiresIn"] =
  (envConfig.jwtTimeOut as SignOptions["expiresIn"]) || "7d";
export interface TokenPayload extends jwt.JwtPayload {
  userId: string;
  email: string;
}

export interface otpTokenPayload extends jwt.JwtPayload {
  email: string;
}

export const generateTokens = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: accessTokenExpiry,
  });

  return { accessToken };
};

export const verifyJWT = (
  token: string,
  res?: Response
): TokenPayload | null => {
  try {
    return jwt.verify(token, accessTokenSecret) as TokenPayload;
  } catch (error: any) {
    console.error("Access Token Error:", error.message);
    if (error.name === "JsonWebTokenError" && res) {
      setAuthCookie(res, "", "User Logged Out");
    }
    return null;
  }
};