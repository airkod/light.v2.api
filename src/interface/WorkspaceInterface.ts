import { Collection, Db } from "mongodb";
import { UserInterface } from "@interface/UserInterface";

export interface WorkspaceInterface {
  meta: {
    database: Db;
    collection: Collection;
    user: UserInterface;
    accessToken: string;
  };
  body: {
    cond: any;
    sort: any;
    limit: number;
    skip: number;
    data: any;
    command: any;
  };
}
