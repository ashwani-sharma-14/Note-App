import { Response } from "express";

export const setAuthCookie = (
  res: Response,
  accessToken: string,
  message: string,
  user?: any
) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("accessToken", accessToken, {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction? "none" : "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    message,
    user,
  });
};
