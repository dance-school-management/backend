import path from "path";
import randomImageName from "./randomImageName";
import { PutObjectCommand } from "@aws-sdk/client-s3";
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

export { uploadPublicPhoto };
