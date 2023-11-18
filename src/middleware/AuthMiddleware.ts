import { Request, Response } from "express";
import { UserHelper } from "@helper/UserHelper";

export const AuthMiddleware = async (req: Request, res: Response, next: any): Promise<void> => {
  return new Promise((): void => {
    UserHelper.isValidAccessToken(req?.headers["access-token"]?.toString())
      .then(() => next())
      .catch(e => res.status(401).send({
        message: e.toString()
      }));
  });
};
