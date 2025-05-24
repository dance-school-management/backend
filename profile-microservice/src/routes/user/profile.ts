import { Router } from "express";
import { editProfile } from "../../controllers/user/profile";
import { body } from "express-validator";
const router = Router();

router.put(
  "/profile",
  body(["name", "surname"])
    .notEmpty()
    .withMessage("Name and surname must not be empty"),
  editProfile,
);

export default router;
