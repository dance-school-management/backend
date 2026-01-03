import path from "path";
import randomImageName from "./randomImageName";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3Client";
import { UniversalError } from "../../errors/UniversalError";

import { StatusCodes } from "http-status-codes";

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

async function uploadPublicPhoto(file: Express.Multer.File): Promise<string> {
  try {
    const fileParsed = path.parse(file.originalname);
    const uniqueFileName = `${fileParsed.name}-${randomImageName()}${fileParsed.ext}`;
    const uniquePath = `public/${uniqueFileName}`;
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: uniquePath,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return uniquePath;
  } catch (error) {
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error uploading photo to storage",
      [],
    );
  }
}

async function deletePublicPhoto(filePath: string): Promise<void> {
  try {
    if (!filePath) return;
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: filePath,
    };
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
  } catch (error) {
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error uploading photo to storage",
      [],
    );
  }
}

async function uploadMultiplePublicPhotos(
  files: Express.Multer.File[],
): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadPublicPhoto(file));
    return Promise.all(uploadPromises);
  } catch (error) {
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error uploading multiple photos to storage",
      [],
    );
  }
}

async function deleteMultiplePublicPhotos(filePaths: string[]): Promise<void> {
  try {
    if (filePaths.length === 0) return;
    const deletePromises = filePaths.map((filePath) =>
      deletePublicPhoto(filePath),
    );
    await Promise.all(deletePromises);
  } catch (error) {
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error deleting multiple photos from storage",
      [],
    );
  }
}

export {
  uploadPublicPhoto,
  deletePublicPhoto,
  uploadMultiplePublicPhotos,
  deleteMultiplePublicPhotos,
};
