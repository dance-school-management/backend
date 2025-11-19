import { Router } from "express";
import { getSearchUsers } from "../../controllers/search-users/search";

const router = Router()

router.get("/", getSearchUsers);

export default router;