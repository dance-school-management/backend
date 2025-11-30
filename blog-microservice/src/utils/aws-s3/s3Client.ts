import { S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

if (
  !AWS_REGION ||
  !AWS_ACCESS_KEY_ID ||
  !AWS_SECRET_ACCESS_KEY ||
  !S3_BUCKET_NAME
) {
  throw new Error(
    "Missing required AWS configuration. Please set AWS_REGION, AWS_ACCESS_KEY_ID, S3_BUCKET_NAME and AWS_SECRET_ACCESS_KEY environment variables.",
  );
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: AWS_REGION,
});

const s3Endpoint = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/`;

export { s3, s3Endpoint };
