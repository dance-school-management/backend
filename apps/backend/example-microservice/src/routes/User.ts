import { Router } from "express";
import { registerUser, loginUser } from "../controllers/User";
import { body } from "express-validator";
import i18next from "../i18n";
const router = Router();


router.post(
  "/register", 
  body('username').isLength({min: 8}).withMessage((value, { req }) => {
    return req.t('validation.length', {len: "8"});
  }),
  registerUser
);

router.post("/login", loginUser);

export default router;