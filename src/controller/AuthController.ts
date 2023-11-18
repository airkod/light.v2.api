import { Request, Response } from "express";
import { UserHelper } from "@helper/UserHelper";
import { SessionInterface } from "@interface/SessionInterface";

export class AuthController {
  static getToken(req: Request, res: Response): void {
    UserHelper.getToken(req.body?.login, req.body?.password)
      .then((session: SessionInterface) => res.send(session))
      .catch((e) => res.status(401).send({ message: e }));
  }

  static refreshToken(req: Request, res: Response): void {
    UserHelper.refreshToken(
      req.body?.login,
      req.body?.password,
      req.body?.accessToken,
      req.body?.refreshToken,
    )
      .then((session: SessionInterface) => res.send(session))
      .catch((e) => res.status(400).send({ message: e }));
  }
}
