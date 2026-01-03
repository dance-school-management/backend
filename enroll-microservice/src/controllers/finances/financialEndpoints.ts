import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { StatusCodes } from "http-status-codes";
import { PaymentStatus } from "../../../generated/client";
import { getCoursesDetails } from "../../grpc/client/productCommunication/getCoursesDetails";
import { UniversalError } from "../../errors/UniversalError";

type Period = "day" | "week" | "month" | "quarter";

interface RevenueBucket {
  startDate: Date;
  endDate: Date;
  revenue: number;
}

export async function adminMetricsRevenue(
  req: Request<
    {},
    {},
    {},
    { startDate?: string; endDate?: string; period?: Period }
  >,
  res: Response,
) {
  let { startDate, endDate, period } = req.query;

  const firstDayOfCurrentMonth = new Date();
  firstDayOfCurrentMonth.setDate(1);
  firstDayOfCurrentMonth.setHours(0);
  firstDayOfCurrentMonth.setMinutes(0);
  firstDayOfCurrentMonth.setSeconds(0);
  firstDayOfCurrentMonth.setMilliseconds(0);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const lastDayOfCurrentMonth = new Date(year, month + 1, 0);

  const startDateAsDate = startDate
    ? new Date(startDate)
    : firstDayOfCurrentMonth;
  const endDateAsDate = endDate ? new Date(endDate) : lastDayOfCurrentMonth;

  if (!period) period = "day";

  const previousPeriodStartDate = new Date(startDateAsDate);

  const durationInMs = endDateAsDate.getTime() - startDateAsDate.getTime();

  previousPeriodStartDate.setTime(startDateAsDate.getTime() - durationInMs);

  const consideredClassTickets = await prisma.classTicket.findMany({
    where: {
      createdAt: {
        gte: previousPeriodStartDate,
        lte: endDateAsDate,
      },
      paymentStatus: PaymentStatus.PAID,
    },
    select: { createdAt: true, cost: true },
  });

  const consideredCourseTickets = await prisma.courseTicket.findMany({
    where: {
      createdAt: {
        gte: previousPeriodStartDate,
        lte: endDateAsDate,
      },
      paymentStatus: PaymentStatus.PAID,
    },
    select: { createdAt: true, cost: true },
  });

  const allTickets = [...consideredClassTickets, ...consideredCourseTickets];

  const totalRevenue = allTickets
    .filter((t) => t.createdAt >= startDateAsDate)
    .map((t) => t.cost.toNumber())
    .reduce((acc, cur) => cur + acc, 0);

  const buckets: RevenueBucket[] = [];

  let currentCursor = new Date(startDateAsDate);

  while (currentCursor < endDateAsDate) {
    const bucketEnd = getNextDate(currentCursor, period);

    const effectiveEndDate =
      bucketEnd > endDateAsDate ? endDateAsDate : bucketEnd;

    const ticketsInBucket = allTickets.filter((ticket) => {
      const ticketDate = new Date(ticket.createdAt);
      return ticketDate >= currentCursor && ticketDate < effectiveEndDate;
    });

    const revenue = ticketsInBucket.reduce(
      (acc, ticket) => acc + ticket.cost.toNumber(),
      0,
    );

    buckets.push({
      startDate: currentCursor,
      endDate: effectiveEndDate,
      revenue: revenue,
    });

    currentCursor = bucketEnd;
  }

  const previousPeriodTotalRevenue = allTickets
    .filter((t) => t.createdAt <= startDateAsDate)
    .map((t) => t.cost.toNumber())
    .reduce((acc, cur) => cur + acc, 0);

  const absolute = Number(
    Math.abs(totalRevenue - previousPeriodTotalRevenue).toFixed(2),
  );
  const percent =
    previousPeriodTotalRevenue !== 0
      ? Number(((absolute / previousPeriodTotalRevenue) * 100).toFixed(2))
      : 0;
  const percentUnavailable = previousPeriodTotalRevenue === 0;

  let trend;
  if (totalRevenue > previousPeriodTotalRevenue) trend = "up";
  else if (totalRevenue === previousPeriodTotalRevenue) trend = "same";
  else trend = "down";

  res.status(StatusCodes.OK).json({
    period: {
      start: startDateAsDate,
      end: endDateAsDate,
    },
    totalRevenue,
    series: buckets.map((b) => ({
      start: b.startDate,
      end: b.endDate,
      revenue: b.revenue,
    })),
    previousPeriod: {
      period: {
        start: previousPeriodStartDate,
        end: startDate,
      },
      totalRevenue: previousPeriodTotalRevenue,
    },
    change: {
      absolute,
      percent,
      percentUnavailable,
      trend,
    },
  });
}

function getNextDate(date: Date, period: Period): Date {
  const result = new Date(date);
  switch (period) {
    case "day":
      result.setDate(result.getDate() + 1);
      break;
    case "week":
      result.setDate(result.getDate() + 7);
      break;
    case "month":
      result.setMonth(result.getMonth() + 1);
      break;
    case "quarter":
      result.setMonth(result.getMonth() + 3);
      break;
    default:
      result.setDate(result.getDate() + 1);
  }
  return result;
}

export async function adminMetricsCoursesTop(
  req: Request<
    {},
    {},
    {},
    { startDate?: string; endDate?: string; limit?: number }
  >,
  res: Response,
) {
  let { startDate, endDate, limit } = req.query;

  if (limit && limit > 20) {
    throw new UniversalError(
      StatusCodes.CONFLICT,
      "Top courses limit can be no more than 20",
      [{ field: "limit", message: "Max is 20" }],
    );
  }

  const firstDayOfCurrentMonth = new Date();
  firstDayOfCurrentMonth.setDate(1);
  firstDayOfCurrentMonth.setHours(0);
  firstDayOfCurrentMonth.setMinutes(0);
  firstDayOfCurrentMonth.setSeconds(0);
  firstDayOfCurrentMonth.setMilliseconds(0);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const lastDayOfCurrentMonth = new Date(year, month + 1, 0);

  const startDateAsDate = startDate
    ? new Date(startDate)
    : firstDayOfCurrentMonth;
  const endDateAsDate = endDate ? new Date(endDate) : lastDayOfCurrentMonth;

  if (!limit) limit = 10;

  const totalCourses = await prisma.courseTicket.findMany({
    where: {
      createdAt: {
        gte: startDateAsDate,
        lte: endDateAsDate,
      },
      paymentStatus: PaymentStatus.PAID,
    },
  });

  const uniqueCoursesIds = [...new Set(totalCourses.map((c) => c.courseId))];

  const coursesGrouped = await prisma.courseTicket.groupBy({
    where: {
      createdAt: {
        gte: startDateAsDate,
        lte: endDateAsDate,
      },
      paymentStatus: PaymentStatus.PAID,
    },
    by: "courseId",
    _sum: {
      cost: true,
    },
  });

  const coursesDetails = (await getCoursesDetails(uniqueCoursesIds))
    .coursesDetailsList;

  const items = coursesGrouped
    .map((cg) => {
      const courseDetails = coursesDetails.find(
        (c) => c.courseId === cg.courseId,
      );
      return {
        courseId: cg.courseId,
        name: courseDetails?.name,
        revenue: Number(cg._sum.cost?.toFixed(2)),
      };
    })
    .sort((course1, course2) => course2.revenue - course1.revenue);

  res.status(StatusCodes.OK).json({
    period: {
      start: startDateAsDate,
      end: endDateAsDate,
    },
    totalCourses: uniqueCoursesIds.length,
    items,
  });
}
