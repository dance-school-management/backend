import { Router } from "express";
import { searchProducts } from "../../controllers/search/search";

const router = Router();

router.get("/", searchProducts);

export default router;