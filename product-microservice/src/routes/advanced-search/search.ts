import { Router } from "express";
import { search } from "../../controllers/advanced-search/search";

const router = Router();

router.get("/", search);

export default router;
