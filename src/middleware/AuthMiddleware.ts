import { Request, Response } from "express";
import { UserHelper } from "@helper/UserHelper";

export const AuthMiddleware = async (req: any | Request, res: Response, next: any): Promise<void> => {
  return new Promise((): void => {
    UserHelper.isValidAccessToken(req.workspace.meta.accessToken)
      .then(() => next())
      .catch(e => res.status(401).end());
  });
};
