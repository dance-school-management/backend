import { Router } from "express";
import {
  createDanceCategory,
  deleteDanceCategory,
  test,
  testing_post,
} from "../controllers/coordinator";
import { body } from "express-validator";
import prisma from "../utils/prisma";
const router = Router();

// router.post("/course");

router.post(
  "/dance_category",
  // body("name").isAlphanumeric().custom(async name => {
  //     const danceCategory = await prisma.danceCategory.findFirst({
  //         where: {
  //             name
  //         }
  //     })
  //     if (danceCategory) {
  //         throw new Error('Dance Category already exists');
  //     }
  // }),
  createDanceCategory,
);

router.delete("/dance_category", deleteDanceCategory);

router.get("/", test);

router.post("/", body("test").isString().notEmpty(), testing_post);

export default router;
