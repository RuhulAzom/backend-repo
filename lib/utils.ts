import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Response } from "express";

export const sendResponse = (
  res: Response,
  status: number,
  message: string,
  data?: any
) => {
  return res.status(status).json({
    status,
    message,
    data,
  });
};

export { bcrypt, jwt };
