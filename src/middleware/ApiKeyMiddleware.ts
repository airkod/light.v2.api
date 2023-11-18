import { Request, Response } from "express";
import { env } from "@env";

export const ApiKeyMiddleware = (req: Request, res: Response, next: any): Promise<any> => {
  if (req?.headers["api-key"] === env.api.key) {
    return next();
  }
  res.status(403).send({ error: "Invalid api key" });
};
