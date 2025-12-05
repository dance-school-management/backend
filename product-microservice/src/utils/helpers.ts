import prisma from "./prisma";

export async function getCoursesAllClassesPrice(coursesIds: number[]) {
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

  const coursesClassesPricesMap: Map<number, number[]> = new Map();

  coursesClasses.forEach((cc) => {
    if (!cc.classTemplate.courseId) return;
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

  const coursesPrices: { courseId: number; price: number }[] = [];

  const keys = [...coursesClassesPricesMap.keys()];

  keys.forEach((k) => {
    const coursePrice = (coursesClassesPricesMap.get(k) ?? []).reduce(
      (acc, cur) => acc + cur,
      0,
    );
    coursesPrices.push({ courseId: k, price: coursePrice });
  });

  return coursesPrices;
}

export async function getCoursesStartAndEndDates(coursesIds: number[]) {
  const allCoursesClasses = await prisma.class.findMany({
    where: {
      classTemplate: {
        courseId: {
          in: coursesIds,
        },
      },
    },
    include: {
      classTemplate: true,
    },
  });

  const allGroupNumbers = [
    ...new Set(allCoursesClasses.map((acc) => acc.groupNumber)),
  ];

  const result = coursesIds.map((ci) => {
    const courseEndDates = allGroupNumbers
      .map((gn) =>
        allCoursesClasses.reduce((acc, cur) => {
          if (
            cur.classTemplate.courseId === ci &&
            cur.groupNumber === gn &&
            cur.endDate > acc.endDate
          )
            return cur;
          else return acc;
        }),
      )
      .map((csd) => ({
        groupNumber: csd.groupNumber,
        courseEndDate: csd.endDate,
      }));
    const courseStartDates = allGroupNumbers
      .map((gn) =>
        allCoursesClasses.reduce((acc, cur) => {
          if (
            cur.classTemplate.courseId === ci &&
            cur.groupNumber === gn &&
            cur.startDate < acc.startDate
          )
            return cur;
          else return acc;
        }),
      )
      .map((csd) => ({
        groupNumber: csd.groupNumber,
        courseStartDate: csd.startDate,
      }));
    return {
      courseId: ci,
      courseStartDates: courseStartDates,
      courseEndDates: courseEndDates
    };
  });

  return result
}

export function hasIntersection<T>(a: Set<T>, b: Set<T>): boolean {
  for (const item of a) {
    if (b.has(item)) {
      return true;
    }
  }
  return false;
}

export function intersectSets<T>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set([...a].filter(x => b.has(x)));
}