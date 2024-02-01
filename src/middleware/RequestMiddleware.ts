import { Request, Response } from "express";
import { WorkspaceHelper } from "@helper/WorkspaceHelper";
import { WorkspaceInterface } from "@interface/WorkspaceInterface";

export const RequestMiddleware = async (req: any | Request | { workspace: WorkspaceInterface }, res: Response, next: any): Promise<any> => {
  req.workspace = await WorkspaceHelper.collect(req);
  return next();
};
