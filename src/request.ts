import { Request as ExpressRequest } from "express";
import { Collection, ObjectId } from "mongodb";
import { Db } from "./db";

export class Request {
  collection: Collection;
  cond: any;
  sort: any;
  limit: number;
  skip: number;
  data: any;

  constructor(req: ExpressRequest | any) {
    this.collection = Db.collection(req?.body?.collection);

    this.cond = req?.body?.cond || {};
    this.sort = req?.body?.sort || {};
    this.limit = req?.body?.limit || 10;
    this.skip = req?.body?.skip || 0;
    this.data = req?.body?.data;

    if (this.cond?._id) {
      this.cond._id = new ObjectId(req?.body?._id);
    }
  }
}
