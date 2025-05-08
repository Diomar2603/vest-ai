import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { BaseRequest } from "../models/requests/BaseRequest";

export const authMiddleware = (req: BaseRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Acesso negado, token ausente" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
    return;
  }
};
