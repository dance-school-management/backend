import { Request, Response } from "express";
import { getMostPopularCoursesIds } from "../../grpc/client/enrollCommunication/getMostPopularCoursesIds";
import { StatusCodes } from "http-status-codes";
import prisma from "../../utils/prisma";
import { getCoursesPrices } from "../../utils/helpers";

export async function getMostPopularCourses(
  req: Request<
    {},
    {},
    {},
    { startDateFrom: string; startDateTo: string; topK: number }
  > & {
    user?: any;
  },
  res: Response,
) {
  const { startDateFrom, startDateTo, topK } = req.query;

  const consideredCoursesIds = (
    await prisma.class.findMany({
      where: {
        startDate: {
          gte: startDateFrom,
          lte: startDateTo,
        },
      },
      include: {
        classTemplate: true,
      },
    })
  ).map((c) => c.classTemplate.courseId);

  const uniqueConsideredCoursesIds = [...new Set(consideredCoursesIds)].filter(
    (cci) => cci !== null,
  );

  const mostPopularCoursesIdsWithInstructors = (
    await getMostPopularCoursesIds(uniqueConsideredCoursesIds, topK)
  ).coursesInstructorsList;

  const mostPopularCoursesIds = mostPopularCoursesIdsWithInstructors.map(
    (cil) => cil.courseId,
  );

  const mostPopularCourses = await prisma.course.findMany({
    where: {
      id: {
        in: mostPopularCoursesIds,
      },
    },
    include: {
      danceCategory: true,
      advancementLevel: true,
    },
  });

  const mostPopularCoursesSorted = mostPopularCoursesIds.map((mpci) =>
    mostPopularCourses.find((mpc) => mpc.id === mpci),
  );

  const coursesPrices = await getCoursesPrices(mostPopularCoursesIds);

  const result = mostPopularCoursesSorted.map((mpcs) => ({
    ...mpcs,
    coursePrice: coursesPrices.find((cp) => cp.courseId === mpcs?.id)?.price,
    customPrice: undefined,
    instructors: mostPopularCoursesIdsWithInstructors.find(
      (mpciwi) => mpciwi.courseId === mpcs?.id,
    )?.instructorsDataList,
  }));

  res.status(StatusCodes.OK).json(result);
}
