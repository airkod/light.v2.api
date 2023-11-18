import { Collection, Db } from "mongodb";
import { UserInterface } from "@interface/UserInterface";

export interface RequestInterface {
  database: Db;
  collection: Collection;
  cond: any;
  sort: any;
  limit: number;
  skip: number;
  data: any;
  command: any;
  user: UserInterface;
}
