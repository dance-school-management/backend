import { NextFunction, Request, Response, Router } from "express";
import { editProfile } from "../../controllers/user/profile";
import { body } from "express-validator";
import upload from "../../utils/multer";
const router = Router();

router.put(
  "/profile",
  upload.single("photo"),
  (req: Request, res: Response, next: NextFunction) => {
    const favDanceCategories = req.body.favouriteDanceCategories as unknown as
      | string
      | undefined;
    const intArr = favDanceCategories?.split(",").map((item) => {
      return parseInt(item.trim());
    });
    req.body.favouriteDanceCategories = intArr || [];
    next();
  },
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("surname").optional().notEmpty().withMessage("Surname cannot be empty"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Invalid phone number format"),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date format"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("favouriteDanceCategories")
    .optional()
    .notEmpty()
    .withMessage("Favorite dance categories must be not empty array")
    .bail()
    .custom((arr) => {
      console.log(typeof arr[0]);

      return Array.isArray(arr) && arr.every(Number.isInteger);
    })
    .withMessage("Each favorite dance category must be an integer"),
  // .custom((value, { req }) => {
  //   //add checking if favouriteDanceCategories exists
  // },
  editProfile,
);

export default router;
