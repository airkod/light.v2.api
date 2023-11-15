import { Request, Response } from "express";
import { env } from "./env";

export const isAuth = (req: Request, res: Response, next: any): Promise<any> => {
  if (req?.headers["access-token"] === env.access.token) {
    return next();
  }
  res.status(401).send({ error: "Invalid access token" });
};
