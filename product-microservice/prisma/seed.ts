import {
  ClassStatus,
  ClassType,
  CourseStatus,
  PrismaClient,
} from "../generated/client";
import danceCategoriesJson from "../../data/product/danceCategories.json";
import advancementLevelsJson from "../../data/product/advancementLevels.json";
import classRoomsJson from "../../data/product/classRooms.json";
import coursesJson from "../../data/product/courses.json";
import classTemplatesJson from "../../data/product/classTemplates.json";
import classesJson from "../../data/product/classes.json";
import logger from "../src/utils/winston";

const prisma = new PrismaClient();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  for (const danceCategory of danceCategoriesJson) {
    try {
      await prisma.danceCategory.upsert({
        where: {
          id: danceCategory.id,
        },
        update: {},
        create: {
          name: danceCategory.name,
          description: danceCategory.description,
          photoPath: danceCategory.photoPath,
        },
      });
    } catch (error: any) {
      logger.error(`Error upserting danceCategory with id ${danceCategory.id} \n error: ${error}`);
    }
  }

  for (const advancementLevel of advancementLevelsJson) {
    try {
      await prisma.advancementLevel.upsert({
        where: {
          id: advancementLevel.id,
        },
        update: {},
        create: {
          name: advancementLevel.name,
          description: advancementLevel.description,
        },
      });
    } catch (error: any) {
      logger.error(`Error upserting advancementLevel with id ${advancementLevel.id} \n error: ${error}`);
    }
  }

  for (const classRoom of classRoomsJson) {
    try {
      await prisma.classRoom.upsert({
        where: {
          id: classRoom.id,
        },
        update: {},
        create: {
          name: classRoom.name,
          description: classRoom.description,
          peopleLimit: classRoom.peopleLimit,
        },
      });
    } catch (error: any) {
      logger.error(`Error upserting classRoom with id ${classRoom.id} \n error: ${error}`);
    }
  }

  for (const course of coursesJson) {
    try {
      await prisma.course.upsert({
        where: {
          id: course.id,
        },
        update: {},
        create: {
          name: course.name,
          description: course.description,
          courseStatus: course.courseStatus as CourseStatus,
          customPrice: course.customPrice,
          advancementLevelId: course.advancementLevelId,
          danceCategoryId: course.danceCategoryId,
        },
      });
    } catch (error: any) {
      logger.error(`Error upserting course with id ${course.id}\n error: ${error}`);
    }
  }

  for (const classTemplate of classTemplatesJson) {
    try {
      await prisma.classTemplate.upsert({
        where: {
          id: classTemplate.id,
        },
        update: {},
        create: {
          classType: classTemplate.classType as ClassType,
          currency: classTemplate.currency,
          description: classTemplate.description,
          name: classTemplate.name,
          price: classTemplate.price,
          advancementLevelId: classTemplate.advancementLevelId,
          courseId: classTemplate.courseId,
          danceCategoryId: classTemplate.danceCategoryId,
          scheduleTileColor: classTemplate.scheduleTileColor,
        },
      });
    } catch (error: any) {
      logger.error(`Error upserting classTemplate with id ${classTemplate.id} \n error: ${error}`);
    }
  }

  for (const aClass of classesJson) {
    try {
      await prisma.class.upsert({
        where: {
          id: aClass.id,
        },
        update: {},
        create: {
          classStatus: aClass.classStatus as ClassStatus,
          endDate: new Date(aClass.endDate),
          startDate: new Date(aClass.startDate),
          peopleLimit: aClass.peopleLimit,
          groupNumber: aClass.groupNumber,
          classRoomId: aClass.classRoomId,
          classTemplateId: aClass.classTemplateId,
        },
      });
    } catch (error: any) {
      logger.error(`Error upserting class with id ${aClass.id} \n error: ${error}`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
