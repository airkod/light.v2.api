import { MongoClient, Db as MongoDb, Collection as MongoCollection } from "mongodb";
import { env } from "./env";

export class Db {
  private static client: MongoClient = null;
  private static db: MongoDb = null;

  static async init(): Promise<void> {
    this.client = new MongoClient(`${env.mongo.scheme}://${env.mongo.host}:${env.mongo.port}`);
    await this.client.connect();
    this.db = this.client.db(env.mongo.db);
  }

  static collection(collection: string): MongoCollection {
    return this.db.collection(collection);
  }

  static close(force?: boolean): void {
    this.client.close(force);
  }
}
