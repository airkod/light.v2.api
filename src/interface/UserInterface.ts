import { Condition, ObjectId } from "mongodb";
import { SessionInterface } from "./SessionInterface";

export interface UserInterface {
  _id?: Condition<ObjectId>;
  login?: string;
  password?: string;
  sessions?: Array<SessionInterface>;
  database?: string;
}
