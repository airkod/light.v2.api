import express, { Express, Request as ExpressRequest, Response } from "express";
import { env } from "./env";
import { Crud } from "./crud";
import { isAuth } from "./auth";
import { Request } from "./request";
import { Db } from "./db";
import { error } from "./error";

const main = async () => {
  await Db.init();
  const app: Express = express();

  app.use(express.json());
  app.use(isAuth);
  app.use(error);

  app.post("/all", async (req: ExpressRequest, res: Response) => {
    res.send(await Crud.all(new Request(req)));
  });

  app.post("/count", async (req: ExpressRequest, res: Response) => {
    res.send((await Crud.count(new Request(req))).toString());
  });

  app.post("/one", async (req: ExpressRequest, res: Response) => {
    res.send(await Crud.one(new Request(req)));
  });

  app.post("/insertOne", async (req: ExpressRequest, res: Response) => {
    res.send(await Crud.insertOne(new Request(req)));
  });

  app.post("/insertMany", async (req: ExpressRequest, res: Response) => {
    res.send(await Crud.insertMany(new Request(req)));
  });

  app.post("/updateOne", async (req: ExpressRequest, res: Response) => {
    res.send(await Crud.updateOne(new Request(req)));
  });

  app.post("/updateMany", async (req: ExpressRequest, res: Response) => {
    res.send(await Crud.updateMany(new Request(req)));
  });

  app.post("/deleteOne", async (req: ExpressRequest, res: Response) => {
    res.send(await Crud.deleteOne(new Request(req)));
  });

  app.post("/deleteMany", async (req: ExpressRequest, res: Response) => {
    res.send(await Crud.deleteMany(new Request(req)));
  });

  app.listen(env.main.port, env.main.host, () => {
    console.log(`Server is running at http://${env.main.host}:${env.main.port}`);
  });
};

main();
