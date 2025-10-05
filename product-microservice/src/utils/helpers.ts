import prisma from "./prisma";

export async function getCoursesPrices(coursesIds: number[]) {
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
