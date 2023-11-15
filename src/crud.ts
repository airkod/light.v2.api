import { Request } from "./request";

export class Crud {
  static async all(req: Request): Promise<{ count: number, data: Array<any> }> {
    const count = await req.collection.countDocuments(req.cond);
    const data = await req.collection
      .find(req.cond)
      .sort(req.sort)
      .limit(req.limit)
      .skip(req.skip)
      .toArray();

    return { count, data };
  }

  static async count(req: Request): Promise<number> {
    return await req.collection.countDocuments(req.cond);
  }

  static async one(req: Request): Promise<any> {
    return await req.collection.findOne(req.cond);
  }

  static async insertOne(req: Request): Promise<{ _id: string }> {
    const insertedObject = await req.collection.insertOne(req.data);
    return { ...req.data, _id: insertedObject.insertedId };
  }

  static async insertMany(req: Request): Promise<Array<any>> {
    const insertedObjects = await req.collection.insertMany(req.data);

    return req.data.map((doc: any, index: number) => {
      return { ...doc, _id: insertedObjects.insertedIds[index] };
    });
  }

  static async updateOne(req: Request): Promise<void> {
    await req.collection.updateOne(req.cond, {
      $set: req.data,
    });
  }

  static async updateMany(req: Request): Promise<void> {
    await req.collection.updateMany(req.cond, {
      $set: req.data,
    });
  }

  static async deleteOne(req: Request): Promise<void> {
    await req.collection.deleteOne(req.cond);
  }

  static async deleteMany(req: Request): Promise<void> {
    await req.collection.deleteMany(req.cond);
  }
}
