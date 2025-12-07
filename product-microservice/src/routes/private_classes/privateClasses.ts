import { Router } from "express";
import {
  createPrivateClass,
  createPrivateClassTemplate,
  editPrivateClass,
  editPrivateClassTemplate,
  getPrivateClassTemplateDetails,
  getPrivateClasses,
  getPrivateClassTemplates,
  getPrivateClassDetails,
  deletePrivateClassTemplate,
} from "../../controllers/private_classes/privateClasses";

const router = Router();

router.post("/class-template", createPrivateClassTemplate);
router.put("/class-template", editPrivateClassTemplate);
router.get("/class-template/:id", getPrivateClassTemplateDetails);
router.get("/class-template", getPrivateClassTemplates);
router.delete("/class-template/:id", deletePrivateClassTemplate);

router.post("/class", createPrivateClass);
router.put("/class", editPrivateClass);
router.get("/class/:id", getPrivateClassDetails);
router.get("/class", getPrivateClasses);

export default router;
