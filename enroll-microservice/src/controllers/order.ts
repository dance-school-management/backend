import { NextFunction, Request, Response } from "express";
import { checkClass } from "../utils/grpcClients";

export async function makeClassOrder(req: Request, res: Response) {
  const { classId } = req.body;
  const response = await checkClass(classId);
  res.json(response);
}
