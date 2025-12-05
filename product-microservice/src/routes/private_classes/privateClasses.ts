import { Router } from "express";
import {
  createPrivateClass,
  createPrivateClassTemplate,
  editPrivateClass,
  editPrivateClassTemplate,
  getClassTemplateDetails,
  getPrivateClasses,
  getPrivateClassTemplates,
} from "../../controllers/private_classes/privateClasses";

const router = Router();

router.post("/class-template", createPrivateClassTemplate);
router.put("/class-template", editPrivateClassTemplate);
router.get("/class-templates", getPrivateClassTemplates);
router.get("/class-templates/:id", getClassTemplateDetails);

router.post("/class", createPrivateClass);
router.put("/class", editPrivateClass);
router.get("/classes", getPrivateClasses);

export default router;
