import { Request, Response } from "express";
import { s3Endpoint } from "../../utils/aws-s3/s3Client";
import { StatusCodes } from "http-status-codes";

export const getS3Endpoint = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ endpoint: s3Endpoint });
};
