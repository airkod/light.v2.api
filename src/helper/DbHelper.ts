import { MongoClient, Db } from "mongodb";
import { env } from "@env";

export class DbHelper {
  private static client: MongoClient = null;

  static async init(): Promise<void> {
    this.client = new MongoClient(`${env.mongo.scheme}://${env.mongo.host}:${env.mongo.port}`);
    await this.client.connect();
  }

  public static db(dbName: string): Db {
    return this.client.db(dbName);
  }

  public static close(force?: boolean): Promise<void> {
    return this.client.close(force);
  }

  public static rootDb(): Db {
    return this.client.db(env.mongo.rootDbName);
  }
}
