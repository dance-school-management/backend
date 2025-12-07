import { Router } from "express";
import { getS3Endpoint } from "../../controllers/s3/s3";

const router = Router();

router.get("/", getS3Endpoint);

export default router;
