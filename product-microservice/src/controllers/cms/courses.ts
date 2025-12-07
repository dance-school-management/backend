import { Request, Response } from "express";
import { Prisma, CourseStatus, Course } from "../../../generated/client";
import prisma from "../../utils/prisma";
import { StatusCodes } from "http-status-codes";
import { checkValidations } from "../../utils/errorHelpers";
import { validationResult } from "express-validator";
import { UniversalError } from "../../errors/UniversalError";
import { Warning } from "../../errors/Warning";
import { ClassType } from "../../../generated/client";
import {
  getCoursesAllClassesPrice,
  getCoursesStartAndEndDates,
} from "../../utils/helpers";
import { ClassStatus } from "../../../generated/client";

interface GetCourseFilter {
  danceCategoryIds: number[] | null;
  advancementLevelIds: number[] | null;
  courseStatuses: CourseStatus[] | null;
}

export async function getCourses(
  req: Request<{}, {}, { filter: GetCourseFilter; search_query: string; }>,
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

export async function createCourse(
  req: Request<{}, {}, { name: string; isConfirmation: boolean; }>,
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

  if (process.env.NODE_ENV === "development") {
    await prisma.classTemplate.create({
      data: {
        name: "name",
        description: "description",
        price: 200,
        classType: ClassType.GROUP_CLASS,
        courseId: newCourse.id,
      },
    });
  }

  res.status(StatusCodes.CREATED).json(newCourse);
}

export async function editCourse(
  req: Request<
    {},
    {},
    {
      id: number;
      name?: string;
      description?: string;
      danceCategoryId?: number;
      advancementLevelId?: number;
      price?: number;
    }
  >,
  res: Response,
) {
  checkValidations(validationResult(req));

  const { id, name, description, danceCategoryId, advancementLevelId, price } =
    req.body;

  const theCourse = await prisma.course.findFirst({
    where: {
      id,
    },
  });

  if (!theCourse) {
    throw new UniversalError(StatusCodes.CONFLICT, "Course not found", []);
  }

  const isPublished = theCourse.courseStatus !== CourseStatus.HIDDEN;

  if (isPublished && danceCategoryId) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "The course is published, danceCategoryId cannot be changed",
      [{ field: "danceCategoryId", message: "Should not be provided" }],
    );
  }

  if (isPublished && advancementLevelId) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "The course is published, advancementLevelId cannot be changed",
      [{ field: "advancementLevelId", message: "Should not be provided" }],
    );
  }

  if (isPublished && price) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "The course is published, price cannot be changed",
      [{ field: "price", message: "Should not be provided" }],
    );
  }

  const editedCourse = await prisma.course.update({
    where: {
      id: id,
    },
    data: {
      ...(name && { name }),
      ...(description && { description }),
      ...(!isPublished && danceCategoryId && { danceCategoryId }),
      ...(!isPublished && advancementLevelId && { advancementLevelId }),
      ...(!isPublished && price && { price }),
    },
  });

  res.status(StatusCodes.OK).json(editedCourse);
}

export async function publishCourse(
  req: Request<{ id: string; }, {}, { isConfirmation: boolean; }>,
  res: Response,
) {
  const id = Number(req.params.id);
  const { isConfirmation } = req.body;

  const theCourse = await prisma.course.findFirst({
    where: {
      id,
    },
  });

  if (!theCourse) {
    throw new UniversalError(StatusCodes.CONFLICT, "Course not found", []);
  }

  if (theCourse.courseStatus !== CourseStatus.HIDDEN) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "The course has already been published",
      [],
    );
  }

  const courseClasses = await prisma.class.findMany({
    where: {
      classTemplate: {
        courseId: id,
      },
    },
  });

  if (!courseClasses.length) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "This course doesn't have any classes associated with it",
      [],
    );
  }

  if (!theCourse.price) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "This course doesn't have a price associated with it",
      [],
    );
  }

  const courseStartAndEndDate = (await getCoursesStartAndEndDates([id]))[0];

  if (!isConfirmation) {
    res.status(StatusCodes.OK).json(courseStartAndEndDate);
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.course.update({
      where: {
        id,
      },
      data: {
        courseStatus: CourseStatus.SALE,
      },
    });
    await tx.class.updateMany({
      where: {
        id: {
          in: courseClasses.map((cc) => cc.id),
        },
      },
      data: {
        classStatus: ClassStatus.NORMAL,
      },
    });
  });

  res.status(StatusCodes.OK).json({ message: "Course successfully published" });
}

export async function getCourseDetails(
  req: Request<{ id: string; }, {}, {}>,
  res: Response,
) {
  const id = parseInt(req.params.id);

  const theCourse = await prisma.course.findFirst({
    where: {
      id,
    },
    include: {
      classTemplate: {
        include: {
          class: true,
        },
      },
      danceCategory: true,
      advancementLevel: true,
    },
  });

  if (!theCourse)
    throw new UniversalError(StatusCodes.NOT_FOUND, "Course not found", []);

  const allClassesPrice = (await getCoursesAllClassesPrice([id]))[0]?.price || 0;

  res.status(StatusCodes.OK).json({ ...theCourse, allClassesPrice });
}

export async function deleteCourse(
  req: Request<{ id: string; }, {}, {}>,
  res: Response,
) {
  const id = parseInt(req.params.id);

  const theCourse = await prisma.course.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (!theCourse) {
    throw new UniversalError(StatusCodes.CONFLICT, "Course not found", []);
  }

  if (theCourse.courseStatus !== ClassStatus.HIDDEN)
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Cannot delete this course, because its status is not 'hidden'",
      [],
    );

  await prisma.course.delete({
    where: {
      id,
    },
  });

  res.status(StatusCodes.NO_CONTENT).send();
}
