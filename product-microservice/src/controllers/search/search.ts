import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { StatusCodes } from "http-status-codes";
import {
  getCoursesPrices,
  getCoursesStartAndEndDates,
} from "../../utils/helpers";

interface SearchRequest {
  index: "class_templates" | "courses";
  searchQuery?: string;
  danceCategoriesIds?: number[] | number;
  advancementLevelsIds?: number[] | number;
  priceMin?: number;
  priceMax?: number;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  page: number;
  itemsPerPage: number;
}

export async function searchProducts(
  req: Request<{}, {}, {}, SearchRequest>,
  res: Response,
) {
  try {
    const {
      index,
      searchQuery,
      danceCategoriesIds,
      advancementLevelsIds,
      priceMax,
      priceMin,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
      page,
      itemsPerPage,
    } = req.query;

    const normalizeIds = (value?: number[] | number | string | string[]) => {
      if (!value) return undefined;
      if (Array.isArray(value)) return value.map((v) => Number(v));
      return [Number(value)];
    };

    const categoryIds = normalizeIds(danceCategoriesIds);
    const advancementIds = normalizeIds(advancementLevelsIds);

    const skip = (Number(page) - 1) * Number(itemsPerPage);
    const take = Number(itemsPerPage);

    if (index === "class_templates") {
      const where = {
        ...(searchQuery && {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" as const } },
            {
              description: {
                contains: searchQuery,
                mode: "insensitive" as const,
              },
            },
          ],
        }),
        ...(categoryIds && { danceCategoryId: { in: categoryIds } }),
        ...(advancementIds && { advancementLevelId: { in: advancementIds } }),
        ...(priceMin !== undefined || priceMax !== undefined
          ? {
              price: {
                ...(priceMin !== undefined && { gte: priceMin }),
                ...(priceMax !== undefined && { lte: priceMax }),
              },
            }
          : {}),
      };

      let result = await prisma.classTemplate.findMany({
        where,
        include: {
          danceCategory: true,
          advancementLevel: true,
        },
        skip,
        take,
      });

      const total = await prisma.classTemplate.count({ where });

      const finalResult = result.map((r) => ({
        productId: r.id,
        record: {
          name: r.name,
          description: r.description,
          danceCategory: r.danceCategoryId ? {
            id: r.danceCategoryId,
            name: r.danceCategory?.name,
            description: r.danceCategory?.description
          } : null,
          advancementLevel: r.advancementLevelId ? r.advancementLevel : null,
          price: Number(r.price),
        },
      }));

      res.status(StatusCodes.OK).json({ result: finalResult, total });
      return;
    }

    const result = await prisma.course.findMany({
      where: {
        courseStatus: { not: "HIDDEN" },

        ...(searchQuery && {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
          ],
        }),

        ...(categoryIds && { danceCategoryId: { in: categoryIds } }),
        ...(advancementIds && { advancementLevelId: { in: advancementIds } }),
      },

      include: {
        danceCategory: true,
        advancementLevel: true,
      },
    });

    const coursesStartAndEndDates = await getCoursesStartAndEndDates(
      result.map((c) => c.id),
    );

    const filteredCoursesByDatesIds = coursesStartAndEndDates
      .filter((c) => {
        const earliestGroupCourseStartDate = c.courseStartDates.reduce(
          (acc, cur) => (acc.courseStartDate < cur.courseStartDate ? acc : cur),
        ).courseStartDate;
        const latestGroupCourseEndDate = c.courseEndDates.reduce((acc, cur) =>
          acc.courseEndDate > cur.courseEndDate ? acc : cur,
        ).courseEndDate;

        const conditions = [];

        if (startDateFrom) {
          conditions.push(
            earliestGroupCourseStartDate >= new Date(startDateFrom),
          );
        }
        if (startDateTo) {
          conditions.push(
            earliestGroupCourseStartDate <= new Date(startDateTo),
          );
        }
        if (endDateFrom) {
          conditions.push(latestGroupCourseEndDate >= new Date(endDateFrom));
        }
        if (endDateTo) {
          conditions.push(latestGroupCourseEndDate <= new Date(endDateTo));
        }

        return !conditions.length || conditions.every(Boolean);
      })
      .map((c) => ({
        courseId: c.courseId,
        courseStartDate: c.courseStartDates.reduce((acc, cur) =>
          acc.courseStartDate < cur.courseStartDate ? acc : cur,
        ).courseStartDate,
        courseEndDate: c.courseEndDates.reduce((acc, cur) =>
          acc.courseEndDate > cur.courseEndDate ? acc : cur,
        ).courseEndDate,
      }));

    const resultFilteredByDates = result
      .filter((c) =>
        filteredCoursesByDatesIds.map((c) => c.courseId).includes(c.id),
      )
      .map((c) => {
        const filteredCourseData = filteredCoursesByDatesIds.find(
          (cc) => cc.courseId === c.id,
        );
        return {
          ...c,
          courseStartDate: filteredCourseData
            ? filteredCourseData.courseStartDate
            : null,
          courseEndDate: filteredCourseData
            ? filteredCourseData.courseEndDate
            : null,
        };
      });

    const coursesPrices = await getCoursesPrices(result.map((c) => c.id));

    const filteredCoursesByPricesIds = coursesPrices
      .filter((cp) => {
        const conditions = [];
        if (priceMin) {
          conditions.push(cp.price >= priceMin);
        }
        if (priceMax) {
          conditions.push(cp.price <= priceMax);
        }
        return conditions.every(Boolean);
      })
      .map((cp) => ({
        courseId: cp.courseId,
        price: cp.price,
      }));

    const resultFilteredByPrice = resultFilteredByDates
      .filter((c) =>
        filteredCoursesByPricesIds.map((c) => c.courseId).includes(c.id),
      )
      .map((c) => {
        const filteredCourseData = filteredCoursesByPricesIds.find(
          (cc) => cc.courseId === c.id,
        );
        return {
          ...c,
          price: filteredCourseData?.price,
        };
      });

    const finalResult = resultFilteredByPrice;

    const newResult = finalResult.map((r) => ({
      productId: r.id,
      record: {
        ...r,
        id: undefined,
        danceCategoryId: undefined,
        advancementLevelId: undefined,
        courseStatus: undefined,
        customPrice: undefined,
        danceCategory: r.danceCategoryId
          ? {
              id: r.danceCategoryId,
              name: r.danceCategory?.name,
              description: r.danceCategory?.description,
            }
          : null,
        advancementLevel: r.advancementLevelId ? r.advancementLevel : null,
        price: r.price,
        startDate: r.courseStartDate,
        endDate: r.courseEndDate,
        courseStartDate: undefined,
        courseEndDate: undefined,
      },
    }));

    res.status(StatusCodes.OK).json({
      result: newResult.slice(skip, skip + take),
      total: result.length,
    });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}
