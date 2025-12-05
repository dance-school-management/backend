import { Router } from "express";

import { getAdvancementLevel, getAdvancementLevelList } from "../../controllers/cms/advancementLevel";
import { getAllClassRooms, getClassRoom } from "../../controllers/cms/classRoom";
import { getDanceCategory, getDanceCategoryList } from "../../controllers/cms/danceCategory";

const router = Router();

router.get("/advancement_level", getAdvancementLevelList);
router.get(
  "/advancement_level/:id",
  getAdvancementLevel,
);

router.get("/class_room", getAllClassRooms);
router.get("/class_room/:id", getClassRoom);

router.get("/dance_category", getDanceCategoryList);
router.get("/dance_category/:id", getDanceCategory);

export default router;
