import { Request, Response } from "express";

export const error = (err: any, req: Request, res: Response, next: any): Promise<any> => {
  if (!err) {
    return next();
  }
  res.status(400).send({ error: "Oops, something went wrong" });
};
