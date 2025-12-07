import { Router } from "express";
import upload from "../../utils/multer";
import {
  createPhotoRecord,
  getPhotoRecord,
  createMultiplePhotoRecords,
  deletePhotoRecord,
} from "../../controllers/photo/photo";
import { query } from "express-validator";


const router = Router();

router.post("/", upload.single("photo"), createPhotoRecord);
router.post("/multiple", upload.array("photos"), createMultiplePhotoRecords);

router.get(
  "/",
  query("id").notEmpty().withMessage("Photo ID is required"),
  getPhotoRecord
);
router.delete(
  "/",
  query("id").notEmpty().withMessage("Photo ID is required"),
  deletePhotoRecord
);

export default router;
