import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma";
import { UniversalError } from "../errors/UniversalError";
import { StatusCodes } from "http-status-codes";
import { ClassStatus, Prisma } from "../../generated/client";
import { getStudentClasses } from "../grpc/client/enrollCommunication/getStudentClasses";
import { getInstructorsClasses } from "../grpc/client/enrollCommunication/getInstructorsClasses";
import { CourseStatus } from "../../generated/client";
import { getCoursesPrices } from "../utils/helpers";
import { getClassesInstructors } from "../grpc/client/enrollCommunication/getClassesInstructors";
import { getInstructorsData } from "../grpc/client/profileCommunication/getInstructorsData";

interface GetScheduleParams {
  dateFrom: string;
  dateTo: string;
}

export async function getSchedule(
  req: Request<object, object, object, GetScheduleParams> & { user?: any },
  res: Response,
  next: NextFunction,
) {
  const { dateFrom, dateTo } = req.query;

  const startDate = new Date(dateFrom);
  const endDate = new Date(dateTo);

  const where: any = {
    startDate: { lte: endDate },
    endDate: { gte: startDate },
    classStatus: { notIn: [ClassStatus.HIDDEN] },
  };
  try {
    let classesData = await prisma.class.findMany({
      where,
      include: {
        classTemplate: {
          include: {
            danceCategory: true,
            advancementLevel: true,
            course: true,
          },
        },
      },
    });

    let result;

    if (req.user?.role === "STUDENT") {
      const studentClasses = await getStudentClasses(req.user?.id);
      result = classesData.map((cd) => {
        const studentClass = studentClasses.studentClassesList.find(
          (sc) => sc.classId === cd.id,
        );
        return {
          owned: Boolean(studentClass),
          paymentStatus: studentClass?.paymentStatus || null,
          ...cd,
        };
      });
    } else if (req.user?.role === "INSTRUCTOR") {
      const instructorClasses = await getInstructorsClasses([req.user.id]);
      result = classesData.map((cd) => {
        const instructorClass =
          instructorClasses.instructorsClassesIdsList.find(
            (sc) => sc.classId === cd.id,
          );
        return {
          owned: Boolean(instructorClass),
          ...cd,
        };
      });
    } else {
      result = classesData;
    }

    const classesIds = classesData.map((cd) => cd.id);

    const classesInstructorsIds = (await getClassesInstructors(classesIds))
      .instructorsClassesIdsList;

    const instructorsData = (
      await getInstructorsData([
        ...new Set(classesInstructorsIds.map((ci) => ci.instructorId)),
      ])
    ).instructorsDataList;

    const classesInstructorsMap = new Map();

    classesInstructorsIds.forEach((cii) => {
      if (!classesInstructorsMap.get(cii.classId)) {
        classesInstructorsMap.set(cii.classId, [cii.instructorId]);
      } else {
        classesInstructorsMap.set(cii.classId, [
          ...classesInstructorsMap.get(cii.classId),
          cii.instructorId,
        ]);
      }
    });

    const classesInstructors = classesIds.map((ci) => {
      const instructorIds = classesInstructorsMap.get(ci) ?? [];
      return {
        classId: ci,
        instructors: instructorsData.filter((iid) =>
          instructorIds.includes(iid.id),
        ),
      };
    });

    result = result.map((r) => ({
      instructors: classesInstructors.find((ci) => ci.classId === r.id)
        ?.instructors,
      ...r,
    }));

    res.status(StatusCodes.OK).json(result);
  } catch (err: any) {
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Problem with getting classes",
      [],
    );
  }
}

export async function getSchedulePersonal(
  req: Request<object, object, object, GetScheduleParams> & { user?: any },
  res: Response,
  next: NextFunction,
) {
  const { dateFrom, dateTo } = req.query;

  const startDate = new Date(dateFrom);
  const endDate = new Date(dateTo);
  let userId;
  let role;
  if (req.user) {
    userId = req.user.id;
    role = req.user.role;
  } else {
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Problem with providing user data to product microservice",
      [],
    );
  }
  let classesIds: number[] = [];
  let classes;
  let paymentStatus = null;
  if (role == "STUDENT") {
    const response = await getStudentClasses(userId);
    classes = response.studentClassesList;
    classesIds = classes.map((entry) => entry.classId);
    paymentStatus = classes.find((c) => c.classId)?.paymentStatus;
  } else if (role == "INSTRUCTOR") {
    const response = await getInstructorsClasses([userId]);
    classes = response.instructorsClassesIdsList;
    classesIds = classes.map((entry) => entry.classId);
  } else {
    throw new UniversalError(
      StatusCodes.NOT_FOUND,
      `User with role ${role || "unknown"} doesn't have a personal schedule`,
      [],
    );
  }
  const where: any = {
    id: { in: classesIds },
    startDate: { lte: endDate },
    endDate: { gte: startDate },
    classStatus: { notIn: [ClassStatus.HIDDEN] },
    ...(classesIds.length > 0 ? { id: { in: classesIds } } : {}),
  };
  try {
    const classesData = await prisma.class.findMany({
      where,
      include: {
        classTemplate: {
          include: {
            danceCategory: true,
            advancementLevel: true,
            course: true,
          },
        },
      },
    });

    const classesInstructorsIds = (await getClassesInstructors(classesIds))
      .instructorsClassesIdsList;

    const instructorsData = (
      await getInstructorsData([
        ...new Set(classesInstructorsIds.map((ci) => ci.instructorId)),
      ])
    ).instructorsDataList;

    const classesInstructorsMap = new Map();

    classesInstructorsIds.forEach((cii) => {
      if (!classesInstructorsMap.get(cii.classId)) {
        classesInstructorsMap.set(cii.classId, [cii.instructorId]);
      } else {
        classesInstructorsMap.set(cii.classId, [
          ...classesInstructorsMap.get(cii.classId),
          cii.instructorId,
        ]);
      }
    });

    const classesInstructors = classesIds.map((ci) => {
      const instructorIds = classesInstructorsMap.get(ci) ?? [];
      return {
        classId: ci,
        instructors: instructorsData.filter((iid) =>
          instructorIds.includes(iid.id),
        ),
      };
    });

    const result = classesData.map((cd) => ({
      paymentStatus: paymentStatus,
      instructors: classesInstructors.find((ci) => ci.classId === cd.id)
        ?.instructors,
      ...cd,
    }));

    res.status(StatusCodes.OK).json(result);
  } catch (err: any) {
    throw new UniversalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Problem with getting classes",
      [],
    );
  }
}

export async function getSearchAndFilterCourses(
  req: Request<
    object,
    object,
    {},
    {
      danceCategoryIds: string[];
      advancementLevelIds: string[];
      instructorsIds: string[];
      priceMin: string;
      priceMax: string;
    }
  > & { user?: any },
  res: Response,
) {
  const priceMax = Number(req.query.priceMax);
  const priceMin = Number(req.query.priceMin);

  let danceCategoryIdsQ: string[] = [];
  let advancementLevelIdsQ: string[] = [];
  let instructorsIdsQ: string[] = [];

  if (req.query.danceCategoryIds)
    danceCategoryIdsQ = Array.isArray(req.query.danceCategoryIds)
      ? req.query.danceCategoryIds
      : [req.query.danceCategoryIds];

  if (req.query.advancementLevelIds)
    advancementLevelIdsQ = Array.isArray(req.query.advancementLevelIds)
      ? req.query.advancementLevelIds
      : [req.query.advancementLevelIds];

  if (req.query.instructorsIds)
    instructorsIdsQ = Array.isArray(req.query.instructorsIds)
      ? req.query.instructorsIds
      : [req.query.instructorsIds];

  const danceCategoryIds = danceCategoryIdsQ.map((el) => Number(el));
  const advancementLevelIds = advancementLevelIdsQ.map((el) => Number(el));
  const instructorsIds = instructorsIdsQ;

  const where = {
    ...(danceCategoryIds.length > 0
      ? {
          danceCategoryId: {
            in: danceCategoryIds,
          },
        }
      : null),
    ...(advancementLevelIds.length > 0
      ? {
          advancementLevelId: {
            in: advancementLevelIds,
          },
        }
      : null),
    courseStatus: { not: CourseStatus.HIDDEN },
  };

  const courses = await prisma.course.findMany({
    where,
  });

  const coursesIds = courses.map((c) => c.id);

  const coursesClasses = await prisma.class.findMany({
    where: {
      classTemplate: {
        courseId: {
          in: coursesIds,
        },
      },
    },
    include: {
      classTemplate: {
        include: {
          course: true,
        },
      },
    },
  });

  const classesIds = coursesClasses.map((cc) => cc.id);

  const classesInstructorsIds = (await getClassesInstructors(classesIds))
    .instructorsClassesIdsList;

  const instructorsData = (
    await getInstructorsData([
      ...new Set(classesInstructorsIds.map((ci) => ci.instructorId)),
    ])
  ).instructorsDataList;

  const classesInstructorsMap: Map<number | null | undefined, string[]> =
    new Map();

  classesInstructorsIds.forEach((cii) => {
    const current = classesInstructorsMap.get(cii.classId) ?? [];
    classesInstructorsMap.set(cii.classId, [...current, cii.instructorId]);
  });

  const classesInstructors = classesIds.map((ci) => {
    const instructorIds = classesInstructorsMap.get(ci) ?? [];
    return {
      classId: ci,
      instructors: instructorsData.filter((iid) =>
        instructorIds.includes(iid.id),
      ),
    };
  });

  const coursesClassesInstructors = classesInstructors.map((ci) => ({
    ...ci,
    courseId: coursesClasses.find((cc) => cc.id === ci.classId)?.classTemplate
      .courseId,
  }));

  const coursesInstructorsMap: Map<
    number | null | undefined,
    { id: string; name: string; surname: string }[]
  > = new Map();

  coursesClassesInstructors.forEach((cci) => {
    const current = coursesInstructorsMap.get(cci.courseId) ?? [];
    coursesInstructorsMap.set(cci.courseId, [...current, ...cci.instructors]);
  });

  const coursesClassesPricesMap: Map<number, number[]> = new Map();

  coursesClasses.forEach((cc) => {
    if (!cc.classTemplate.courseId) return;
    if (cc.classTemplate.course?.customPrice) {
      coursesClassesPricesMap.set(cc.classTemplate.courseId, [
        Number(cc.classTemplate.course.customPrice.toFixed(2)),
      ]);
      return;
    }
    if (!coursesClassesPricesMap.get(cc.classTemplate.courseId)) {
      coursesClassesPricesMap.set(cc.classTemplate.courseId, [
        Number(cc.classTemplate.price.toFixed(2)),
      ]);
    } else {
      coursesClassesPricesMap.set(cc.classTemplate.courseId, [
        ...(coursesClassesPricesMap.get(cc.classTemplate.courseId) || []),
        Number(cc.classTemplate.price.toFixed(2)),
      ]);
    }
  });

  const coursesFilteredByPrice: { courseId: number; price: number }[] = [];

  const keys = [...coursesClassesPricesMap.keys()];

  keys.forEach((k) => {
    const coursePrice = (coursesClassesPricesMap.get(k) ?? []).reduce(
      (acc, cur) => acc + cur,
      0,
    );
    if (coursePrice && coursePrice >= priceMin && coursePrice <= priceMax)
      coursesFilteredByPrice.push({ courseId: k, price: coursePrice });
  });

  const resultCourses = await prisma.course.findMany({
    where: {
      id: {
        in: coursesFilteredByPrice.map((cfbp) => cfbp.courseId),
      },
    },
    include: {
      danceCategory: true,
      advancementLevel: true,
    },
  });

  let result = resultCourses.map((rc) => ({
    ...rc,
    coursePrice: coursesFilteredByPrice.find((cfbp) => cfbp.courseId === rc.id)
      ?.price,
    customPrice: undefined,
  }));

  result = result.map((r) => ({
    ...r,
    instructors: [
      ...new Set(
        (coursesInstructorsMap.get(r.id) ?? []).filter((inst) =>
          instructorsIds.includes(inst.id),
        ),
      ),
    ],
  }));

  res.status(StatusCodes.OK).json(result);
}

type AllClassesType = Prisma.ClassGetPayload<{
  include: {
    classTemplate: {
      include: {
        course: {
          include: {
            danceCategory: true;
            advancementLevel: true;
          };
        };
      };
    };
  };
}>[];

export async function getCoursesClasses(
  req: Request<object, object, {}, { coursesIds: string[] }> & { user?: any },
  res: Response,
) {
  let coursesIdsQ: string[] = [];

  if (req.query.coursesIds)
    coursesIdsQ = Array.isArray(req.query.coursesIds)
      ? req.query.coursesIds
      : [req.query.coursesIds];

  const coursesIds = coursesIdsQ.map((ci) => Number(ci));

  const allClasses: AllClassesType = await prisma.class.findMany({
    where: {
      classTemplate: {
        courseId: {
          in: coursesIds,
        },
      },
    },
    include: {
      classTemplate: {
        include: {
          course: {
            include: {
              danceCategory: true,
              advancementLevel: true,
            },
          },
        },
      },
    },
  });

  const coursesClassesMap: Map<number | null | undefined, AllClassesType> =
    new Map();

  allClasses.forEach((c) => {
    const current = coursesClassesMap.get(c.classTemplate.courseId) ?? [];
    coursesClassesMap.set(c.classTemplate.courseId, [...current, c]);
  });

  const result: { courseData: any; classes: any[] }[] = [];

  const keys = [...coursesClassesMap.keys()];

  const coursesPrices = await getCoursesPrices(coursesIds);

  const classesIds = allClasses.map((cl) => cl.id);

  const classesInstructorsIds = (await getClassesInstructors(classesIds))
    .instructorsClassesIdsList;

  const instructorsData = (
    await getInstructorsData([
      ...new Set(classesInstructorsIds.map((ci) => ci.instructorId)),
    ])
  ).instructorsDataList;

  const classesInstructorsMap = new Map();

  classesInstructorsIds.forEach((cii) => {
    if (!classesInstructorsMap.get(cii.classId)) {
      classesInstructorsMap.set(cii.classId, [cii.instructorId]);
    } else {
      classesInstructorsMap.set(cii.classId, [
        ...classesInstructorsMap.get(cii.classId),
        cii.instructorId,
      ]);
    }
  });

  const classesInstructors = classesIds.map((ci) => {
    const instructorIds = classesInstructorsMap.get(ci) ?? [];
    return {
      classId: ci,
      instructors: instructorsData.filter((iid) =>
        instructorIds.includes(iid.id),
      ),
    };
  });

  keys.forEach((k) =>
    result.push({
      courseData: {
        ...allClasses.find((ac) => ac.classTemplate.courseId === k)
          ?.classTemplate.course,
        coursePrice: coursesPrices.find((cp) => cp.courseId === k)?.price,
        customPrice: undefined,
        instructors: [
          ...new Set(
            classesInstructors
              .filter((ci) =>
                allClasses
                  .filter((cc) => cc.classTemplate.courseId === k)
                  .map((cc) => cc.id)
                  .includes(ci.classId),
              )
              .flatMap((ci) => ci.instructors),
          ),
        ],
      },
      classes:
        coursesClassesMap.get(k)?.map((cc) => ({
          ...cc,
          instructors: classesInstructors.find((ci) => ci.classId === cc.id)
            ?.instructors,
        })) ?? [],
    }),
  );

  res.status(StatusCodes.OK).json(result);
}
