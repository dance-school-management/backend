import { Router } from "express";
import { cancelClass } from "../../../controllers/cms/cancelOrPostpone";

const router = Router();

router.get("/test", cancelClass);

export default router;
