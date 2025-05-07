import { Router } from "express";
import { makeClassOrder } from "../../controllers/order";

const router = Router();

router.post('/', makeClassOrder);

export default router; 