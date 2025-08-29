import { Request, Response, NextFunction } from "express";
import { verifyJWT, TokenPayload } from "@/lib/auth";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.json({ message: "access token not found" }).status(401);
    }

    const decoded = verifyJWT(accessToken);

    if (!decoded) {
      return res.json({ message: "invalid access token" }).status(401);
    }

    req.user = decoded;
    return next();
  } catch (error) {
    res.status(500).json({ message: "server error" });
    next(error);
  }
};
