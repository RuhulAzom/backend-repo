import { NextFunction, Request, Response } from "express";
import { jwt } from "../lib/utils";
import env from "dotenv";
import { JwtPayload } from "jsonwebtoken";
env.config();

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.headers)
      return res.status(401).json({
        message: "Unauthorized",
      });
    if (!req.headers.authorization)
      return res.status(401).json({
        message: "Unauthorized",
      });

    const token = req.headers.authorization.split(" ")[1];
    const secretKey = process.env.JWT_TOKEN_KEY;

    if (!secretKey)
      return res.status(404).json({
        message: "Secret key not found",
      });

    let userData = null;
    jwt.verify(token, secretKey, (error, decode) => {
      if (error) userData = null;
      else userData = { ...(decode as JwtPayload), token };
    });

    if (!userData)
      return res.status(401).json({
        message: "Unauthorized",
      });

    (req as any).user = userData;
    return next();
  } catch (error) {}
};
