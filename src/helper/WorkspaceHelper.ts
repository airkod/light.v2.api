import { Request as ExpressRequest } from "express";
import { Collection, Db, ObjectId } from "mongodb";
import { DbHelper } from "@helper/DbHelper";
import { UserHelper } from "@helper/UserHelper";
import { WorkspaceInterface } from "@interface/WorkspaceInterface";
import { UserInterface } from "@interface/UserInterface";

export class WorkspaceHelper {
  public static collect(req: ExpressRequest | WorkspaceInterface | any): Promise<WorkspaceInterface> {
    return new Promise(async (resolve) => {
      const user: UserInterface = await this.propagateDatabase(
        req.workspace.meta.accessToken,
      );

      const database: Db = DbHelper.db(user.database);
      const collection: Collection = database.collection(
        req.workspace.meta.collection,
      );

      const cond = req.workspace.body?.cond || {};
      const sort = req.workspace.body?.sort || {};
      const limit = req.workspace.body?.limit || 10;
      const skip = req.workspace.body?.skip || 0;
      const data = req.workspace.body?.data;
      const command = req.workspace.body?.command || {};

      if (cond?._id) {
        cond._id = new ObjectId(cond._id);
      }

      resolve(
        {
          meta: {
            ...req.workspace.meta,
            user,
            database,
            collection,
          },
          body: {
            cond,
            sort,
            limit,
            skip,
            data,
            command,
          },
        },
      );
    });
  }

  public static async propagateDatabase(accessToken: string): Promise<UserInterface> {
    const user: UserInterface = await UserHelper.getUserByAccessToken(accessToken);

    if (!user.database) {
      await UserHelper.addUserDatabase(user);
    }

    return user;
  }
}
