import { Router } from "express";
import { registerUser } from "../../controllers/cms/cms";

const router = Router();

router.post("/user_register", registerUser);

export default router;
