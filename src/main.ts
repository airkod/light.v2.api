import express, { Express, Request as ExpressRequest, Response } from "express";
import { env } from "@env";
import { RequestHelper } from "@helper/RequestHelper";
import { DbHelper } from "@helper/DbHelper";
import { AuthMiddleware } from "@middleware/AuthMiddleware";
import { CrudController } from "@controller/CrudController";
import { AuthController } from "@controller/AuthController";
import { ApiKeyMiddleware } from "@middleware/ApiKeyMiddleware";
import { ErrorMiddleware } from "@middleware/ErrorMiddleware";

const main = async (): Promise<void> => {
  await DbHelper.init();
  const app: Express = express();

  app
    .use(express.json())
    .use(ErrorMiddleware)
    .use(ApiKeyMiddleware);

  app
    .post("/auth/getToken", AuthController.getToken)
    .post("/auth/refreshToken", AuthController.refreshToken);

  app
    .use(AuthMiddleware)

    .post("/all", async (req: ExpressRequest, res: Response): Promise<void> => {
      res.send(await CrudController.all(await RequestHelper.collect(req)));
    })
    .post("/count", async (req: ExpressRequest, res: Response): Promise<void> => {
      res.send((await CrudController.count(await RequestHelper.collect(req))).toString());
    })
    .post("/one", async (req: ExpressRequest, res: Response): Promise<void> => {
      res.send(await CrudController.one(await RequestHelper.collect(req)));
    })
    .post("/insertOne", async (req: ExpressRequest, res: Response): Promise<void> => {
      res.send(await CrudController.insertOne(await RequestHelper.collect(req)));
    })
    .post("/insertMany", async (req: ExpressRequest, res: Response): Promise<void> => {
      res.send(await CrudController.insertMany(await RequestHelper.collect(req)));
    })
    .post("/updateOne", async (req: ExpressRequest, res: Response): Promise<void> => {
      res.send(await CrudController.updateOne(await RequestHelper.collect(req)));
    })
    .post("/updateMany", async (req: ExpressRequest, res: Response): Promise<void> => {
      res.send(await CrudController.updateMany(await RequestHelper.collect(req)));
    })
    .post("/deleteOne", async (req: ExpressRequest, res: Response): Promise<void> => {
      res.send(await CrudController.deleteOne(await RequestHelper.collect(req)));
    })
    .post("/deleteMany", async (req: ExpressRequest, res: Response): Promise<void> => {
      res.send(await CrudController.deleteMany(await RequestHelper.collect(req)));
    })
    .post("/command", async (req: ExpressRequest, res: Response): Promise<void> => {
      // TODO: Implement command
    });

  app.listen(env.main.port, env.main.host, () => {
    console.log(`Server is running at http://${env.main.host}:${env.main.port}`);
  });
};

main();
