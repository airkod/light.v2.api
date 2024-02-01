import { Request, Response } from "express";
import { env } from "@env";

export const ApiKeyMiddleware = (req: any | Request, res: Response, next: any): Promise<any> => {
  if (req.workspace.meta.apiKey === env.secure.key) {
    return next();
  }
  res.status(403).send({ error: "Invalid api key" });
};
