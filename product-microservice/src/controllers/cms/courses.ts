import { NextFunction, Request, Response } from "express";
import { Prisma, CourseStatus, Course } from "../../../generated/client";
import prisma from "../../utils/prisma";
import { prismaError } from "prisma-better-errors";
import { StatusCodes } from "http-status-codes";
import { checkValidations } from "../../utils/errorHelpers";
import { validationResult } from "express-validator";
import { UniversalError } from "../../errors/UniversalError";
import { Warning } from "../../errors/Warning";

interface GetCourseFilter {
  danceCategoryIds: number[] | null;
  advancementLevelIds: number[] | null;
  courseStatuses: CourseStatus[] | null;
}

export async function getCourses(
  req: Request<{}, {}, { filter: GetCourseFilter; search_query: string }>,
  res: Response,
) {
  const { filter, search_query } = req.body;

  const courseFiltersAndSearch: Prisma.CourseWhereInput[] = [];

  if (filter.danceCategoryIds && filter.danceCategoryIds.length > 0) {
    courseFiltersAndSearch.push({
      danceCategoryId: { in: filter.danceCategoryIds },
    });
  }

  if (filter.advancementLevelIds && filter.advancementLevelIds.length > 0) {
    courseFiltersAndSearch.push({
      advancementLevelId: { in: filter.advancementLevelIds },
    });
  }

  if (filter.courseStatuses) {
    courseFiltersAndSearch.push({
      courseStatus: { in: filter.courseStatuses },
    });
  }

  if (search_query) {
    courseFiltersAndSearch.push({
      OR: [
        { name: { contains: search_query, mode: "insensitive" } },
        { description: { contains: search_query, mode: "insensitive" } },
      ],
    });
  }

  const result = await prisma.course.findMany({
    relationLoadStrategy: "join",
    include: {
      danceCategory: true,
      advancementLevel: true,
    },
    where: {
      AND: courseFiltersAndSearch,
    },
  });

  res.status(StatusCodes.OK).json(result);
}

export async function addCourse(
  req: Request<{}, {}, { name: string; isConfirmation: boolean }>,
  res: Response,
) {
  checkValidations(validationResult(req));
  const { name, isConfirmation } = req.body;

  if (!isConfirmation) {
    const alreadyExistingCourse = await prisma.course.findFirst({
      where: {
        name,
      },
    });
    if (alreadyExistingCourse)
      throw new Warning(
        "There is already a course with this name",
        StatusCodes.CONFLICT,
      );
  }

  const newCourse = await prisma.course.create({
    data: {
      name: name,
      description: "Sample description",
      courseStatus: CourseStatus.HIDDEN,
    },
  });
  res.status(StatusCodes.CREATED).json(newCourse);
}

export async function editCourse(req: Request<{}, {}, Course>, res: Response) {
  checkValidations(validationResult(req));

  const {
    id,
    name,
    description,
    danceCategoryId,
    advancementLevelId,
    customPrice,
  } = req.body;

  const editedCourse = await prisma.course.update({
    where: {
      id: id,
    },
    data: {
      name,
      description,
      danceCategoryId,
      advancementLevelId,
      customPrice,
    },
  });
  res.status(StatusCodes.OK).json(editedCourse);
}
