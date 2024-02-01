import express, { Express, Request, Response } from "express";
import { env } from "@env";
import { DbHelper } from "@helper/DbHelper";
import { CryptHelper } from "@helper/CryptHelper";
import { CrudController } from "@controller/CrudController";
import { AuthController } from "@controller/AuthController";
import { SessionInterface } from "@interface/SessionInterface";
import { AuthMiddleware } from "@middleware/AuthMiddleware";
import { ApiKeyMiddleware } from "@middleware/ApiKeyMiddleware";
import { ErrorMiddleware } from "@middleware/ErrorMiddleware";
import { RequestMiddleware } from "@middleware/RequestMiddleware";
import { DecryptMiddleware } from "@middleware/DecryptMiddleware";
import { CorsMiddleware } from "@middleware/CorsMiddleware";

const main = async (): Promise<void> => {
  await DbHelper.init();
  const app: Express = express();

  app
    .use(CorsMiddleware)
    .use(express.json())
    .use(ErrorMiddleware)
    .use(DecryptMiddleware)
    .use(ApiKeyMiddleware)

    .post("/auth", (req: any | Request, res: Response): void => {
      AuthController.auth(req.workspace.body)
        .then((session: SessionInterface) => CryptHelper.encrypt(session))
        .then((encData: any) => res.send(encData))
        .catch(() => res.status(400).end());
    });

  app
    .use(AuthMiddleware)
    .use(RequestMiddleware);

  const operations = {
    "/all": CrudController.all,
    "/one": CrudController.one,
    "/count": CrudController.count,
    "/insertOne": CrudController.insertOne,
    "/insertMany": CrudController.insertMany,
    "/updateOne": CrudController.updateOne,
    "/updateMany": CrudController.updateMany,
    "/deleteOne": CrudController.deleteOne,
    "/deleteMany": CrudController.deleteMany,
    "/command": CrudController.command,
  };

  for (const [ url, operation ] of Object.entries(operations)) {
    app.post(url, (req: any | Request, res: Response): void => {
      operation(req.workspace)
        .then((data: any) => CryptHelper.encrypt(data))
        .then((encData: any) => res.send(encData))
        .catch((e: any) => res.status(400).end());
    });
  }

  app.listen(env.main.port, env.main.host, () => {
    console.log(`Server is running at http://${env.main.host}:${env.main.port}`);
  });
};

main();
