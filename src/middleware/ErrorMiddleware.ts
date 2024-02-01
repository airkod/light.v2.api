import { Request, Response } from "express";

export const ErrorMiddleware = (err: any, req: Request, res: Response, next: any): Promise<any> => {
  if (!err) {
    return next();
  }
  res.status(500).end();
};
