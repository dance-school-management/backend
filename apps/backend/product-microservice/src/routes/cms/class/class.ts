import { Router } from "express";
import {
  createClass,
  getPossibleInstructorIds,
} from "../../../controllers/cms/class";

const router = Router();

router.post("/new", createClass);
router.post("/possible_instructors", getPossibleInstructorIds);

export default router;
