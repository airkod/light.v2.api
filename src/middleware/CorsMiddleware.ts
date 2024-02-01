import { NextFunction, Request, Response } from "express";

export const CorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-type, Accept, User-agent");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
};
