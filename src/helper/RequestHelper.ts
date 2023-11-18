import { Request as ExpressRequest } from "express";
import { Collection, Db, ObjectId } from "mongodb";
import { DbHelper } from "@helper/DbHelper";
import { UserHelper } from "@helper/UserHelper";
import { RequestInterface } from "@interface/RequestInterface";
import { UserInterface } from "@interface/UserInterface";

export class RequestHelper {
  public static collect(req: ExpressRequest | any): Promise<RequestInterface> {
    return new Promise(async (resolve) => {
      const user: UserInterface = await this.propagateDatabase(req);

      const database: Db = DbHelper.db(user.database);
      const collection: Collection = database.collection(req?.body?.collection);

      const cond = req?.body?.cond || {};
      const sort = req?.body?.sort || {};
      const limit = req?.body?.limit || 10;
      const skip = req?.body?.skip || 0;
      const data = req?.body?.data;
      const command = req?.body?.command || {};

      if (cond?._id) {
        cond._id = new ObjectId(cond._id);
      }

      resolve({ user, database, collection, cond, sort, limit, skip, data, command });
    });
  }

  public static async propagateDatabase(req: ExpressRequest): Promise<UserInterface> {
    const user: UserInterface = await UserHelper.getUserByAccessToken(
      req?.headers["access-token"]?.toString(),
    );

    if (!user.database) {
      await UserHelper.addUserDatabase(user);
    }

    return user;
  }
}
