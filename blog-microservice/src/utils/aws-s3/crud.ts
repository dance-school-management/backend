import path from "path";
import randomImageName from "./randomImageName";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3Client";

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

async function uploadPublicPhoto(file: Express.Multer.File): Promise<string> {
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
}

async function deletePublicPhoto(filePath: string): Promise<void> {
  if (!filePath) return;
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: filePath,
  };
  const command = new DeleteObjectCommand(params);
  await s3.send(command);
}

async function uploadMultiplePublicPhotos(
  files: Express.Multer.File[]
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadPublicPhoto(file));
  return Promise.all(uploadPromises);
}

async function deleteMultiplePublicPhotos(filePaths: string[]): Promise<void> {
  if (filePaths.length === 0) return;
  const deletePromises = filePaths.map((filePath) =>
    deletePublicPhoto(filePath)
  );
  await Promise.all(deletePromises);
}

export {
  uploadPublicPhoto,
  deletePublicPhoto,
  uploadMultiplePublicPhotos,
  deleteMultiplePublicPhotos,
};
