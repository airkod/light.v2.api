import { WithId, Document } from "mongodb";
import { WorkspaceInterface } from "@interface/WorkspaceInterface";

export class CrudController {
  static async all(req: WorkspaceInterface): Promise<{ count: number, data: Array<any> }> {
    const count: number = await req.meta.collection.countDocuments(req.body.cond);
    const data: Array<WithId<Document>> = await req.meta.collection
      .find(req.body.cond)
      .sort(req.body.sort)
      .limit(req.body.limit)
      .skip(req.body.skip)
      .toArray();

    return { count, data };
  }

  static async count(req: WorkspaceInterface): Promise<string> {
    return (await req.meta.collection.countDocuments(req.body.cond)).toString();
  }

  static async one(req: WorkspaceInterface): Promise<any> {
    return await req.meta.collection.findOne(req.body.cond);
  }

  static async insertOne(req: WorkspaceInterface): Promise<{ _id: string }> {
    const insertedObject = await req.meta.collection.insertOne(req.body.data);
    return { ...req.body.data, _id: insertedObject.insertedId };
  }

  static async insertMany(req: WorkspaceInterface): Promise<Array<any>> {
    const insertedObjects = await req.meta.collection.insertMany(req.body.data);

    return req.body.data.map((doc: any, index: number) => {
      return { ...doc, _id: insertedObjects.insertedIds[index] };
    });
  }

  static async updateOne(req: WorkspaceInterface): Promise<void> {
    await req.meta.collection.updateOne(req.body.cond, {
      $set: req.body.data,
    });
  }

  static async updateMany(req: WorkspaceInterface): Promise<void> {
    await req.meta.collection.updateMany(req.body.cond, {
      $set: req.body.data,
    });
  }

  static async deleteOne(req: WorkspaceInterface): Promise<void> {
    await req.meta.collection.deleteOne(req.body.cond);
  }

  static async deleteMany(req: WorkspaceInterface): Promise<void> {
    await req.meta.collection.deleteMany(req.body.cond);
  }

  static async command(req: WorkspaceInterface): Promise<any> {
    return await req.meta.database.command(req.body.command);
  }
}
