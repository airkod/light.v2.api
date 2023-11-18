import { Collection } from "mongodb";
import { UserInterface } from "@interface/UserInterface";

export interface RequestInterface {
  collection: Collection;
  cond: any;
  sort: any;
  limit: number;
  skip: number;
  data: any;
  user: UserInterface;
}
