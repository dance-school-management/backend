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

  const result = coursesIds.map((ci) => {
    const courseClasses = allCoursesClasses.filter(
      (acc) => acc.classTemplate.courseId === ci,
    );
    const courseStartDate = courseClasses.reduce((acc, cur) =>
      acc.startDate < cur.startDate ? acc : cur,
    ).startDate;
    const courseEndDate = courseClasses.reduce((acc, cur) =>
      acc.endDate > cur.endDate ? acc : cur,
    ).endDate;
    return {
      courseId: ci,
      courseStartDate,
      courseEndDate,
    };
  });

  return result;
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
  return new Set([...a].filter((x) => b.has(x)));
}
