import { Request, Response } from "express";
import { CryptHelper } from "@helper/CryptHelper";

export const DecryptMiddleware = async (req: any | Request, res: Response, next: any): Promise<void> => {
  CryptHelper.decrypt(req.body)
    .then((body: any) => {
      req.workspace = body;
      next();
    })
    .catch((e) => {
      res.status(400).end();
    });
};
