import { WithId, Document } from "mongodb";
import { RequestInterface } from "@interface/RequestInterface";

export class CrudController {
  static async all(req: RequestInterface): Promise<{ count: number, data: Array<any> }> {
    const count: number = await req.collection.countDocuments(req.cond);
    const data: Array<WithId<Document>> = await req.collection
      .find(req.cond)
      .sort(req.sort)
      .limit(req.limit)
      .skip(req.skip)
      .toArray();

    return { count, data };
  }

  static async count(req: RequestInterface): Promise<number> {
    return await req.collection.countDocuments(req.cond);
  }

  static async one(req: RequestInterface): Promise<any> {
    return await req.collection.findOne(req.cond);
  }

  static async insertOne(req: RequestInterface): Promise<{ _id: string }> {
    const insertedObject = await req.collection.insertOne(req.data);
    return { ...req.data, _id: insertedObject.insertedId };
  }

  static async insertMany(req: RequestInterface): Promise<Array<any>> {
    const insertedObjects = await req.collection.insertMany(req.data);

    return req.data.map((doc: any, index: number) => {
      return { ...doc, _id: insertedObjects.insertedIds[index] };
    });
  }

  static async updateOne(req: RequestInterface): Promise<void> {
    await req.collection.updateOne(req.cond, {
      $set: req.data,
    });
  }

  static async updateMany(req: RequestInterface): Promise<void> {
    await req.collection.updateMany(req.cond, {
      $set: req.data,
    });
  }

  static async deleteOne(req: RequestInterface): Promise<void> {
    await req.collection.deleteOne(req.cond);
  }

  static async deleteMany(req: RequestInterface): Promise<void> {
    await req.collection.deleteMany(req.cond);
  }
}
