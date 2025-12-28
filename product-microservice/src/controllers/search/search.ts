import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import { StatusCodes } from "http-status-codes";
import { getCoursesStartAndEndDates } from "../../utils/helpers";

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
          danceCategory: r.danceCategoryId
            ? {
                id: r.danceCategoryId,
                name: r.danceCategory?.name,
                description: r.danceCategory?.description,
              }
            : null,
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
        ...(priceMin !== undefined || priceMax !== undefined
          ? {
              price: {
                ...(priceMin !== undefined && { gte: priceMin }),
                ...(priceMax !== undefined && { lte: priceMax }),
              },
            }
          : {}),
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
        const courseStartDate = c.courseStartDate;
        const courseEndDate = c.courseEndDate;

        const conditions = [];

        if (startDateFrom && courseStartDate) {
          conditions.push(courseStartDate >= new Date(startDateFrom));
        }
        if (startDateTo && courseStartDate) {
          conditions.push(courseStartDate <= new Date(startDateTo));
        }
        if (endDateFrom && courseEndDate) {
          conditions.push(courseEndDate >= new Date(endDateFrom));
        }
        if (endDateTo && courseEndDate) {
          conditions.push(courseEndDate <= new Date(endDateTo));
        }

        return !conditions.length || conditions.every(Boolean);
      })
      .map((c) => ({
        courseId: c.courseId,
        courseStartDate: c.courseStartDate,
        courseEndDate: c.courseEndDate,
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

    const finalResult = resultFilteredByDates;

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
        price: r.price ? Number(r.price.toFixed(2)) : null,
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
