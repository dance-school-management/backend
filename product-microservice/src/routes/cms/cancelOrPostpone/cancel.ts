import { Router } from "express";
import { cancelClass } from "../../../controllers/cms/cancelOrPostpone";

const router = Router();

router.post("/class", cancelClass);

export default router;
