import { Router } from "express";
import { createPrivateClass, createPrivateClassTemplate } from "../../controllers/private_classes/privateClasses";

const router = Router()

router.post("/class-template", createPrivateClassTemplate)
router.post("/class", createPrivateClass)

export default router;