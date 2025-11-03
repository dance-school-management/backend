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
import {
  ClassTemplateDocument,
  CourseDocument,
  esClient,
} from "../src/elasticsearch/client";
import { embed } from "../src/grpc/client/aiCommunication/embed";

const prisma = new PrismaClient();

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
      logger.error(
        `Error upserting danceCategory with id ${danceCategory.id} \n error: ${error}`,
      );
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
      logger.error(
        `Error upserting advancementLevel with id ${advancementLevel.id} \n error: ${error}`,
      );
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
      logger.error(
        `Error upserting classRoom with id ${classRoom.id} \n error: ${error}`,
      );
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
      logger.error(
        `Error upserting course with id ${course.id}\n error: ${error}`,
      );
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
      logger.error(
        `Error upserting classTemplate with id ${classTemplate.id} \n error: ${error}`,
      );
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
      logger.error(
        `Error upserting class with id ${aClass.id} \n error: ${error}`,
      );
    }
  }
  if (await esClient.indices.exists({ index: "class_templates" }))
    await esClient.indices.delete({ index: "class_templates" });
  if (await esClient.indices.exists({ index: "courses" }))
    await esClient.indices.delete({ index: "courses" });

  for (const classTemplate of classTemplatesJson) {
    const descEmbedded = (await embed(classTemplate.description, false))
      .embeddingList;
    const danceCategory = danceCategoriesJson.find(
      (dc) => dc.id === classTemplate.danceCategoryId,
    );
    const advancementLevel = advancementLevelsJson.find(
      (al) => al.id === classTemplate.advancementLevelId,
    );
    const doc: ClassTemplateDocument = {
      name: classTemplate.name,
      description: classTemplate.description,
      descriptionEmbedded: descEmbedded,
      danceCategory: danceCategory
        ? {
            id: danceCategory?.id,
            name: danceCategory?.name,
            description: danceCategory?.description,
          }
        : null,
      advancementLevel: advancementLevel
        ? {
            id: advancementLevel.id,
            name: advancementLevel.name,
            description: advancementLevel.description,
          }
        : null,
      price: classTemplate.price,
    };
    await esClient.index({
      index: "class_templates",
      id: String(classTemplate.id),
      document: doc,
    });
  }

  for (const course of coursesJson) {
    const descEmbedded = (await embed(course.description, false)).embeddingList;
    const danceCategory = danceCategoriesJson.find(
      (dc) => dc.id === course.danceCategoryId,
    );
    const advancementLevel = advancementLevelsJson.find(
      (al) => al.id === course.advancementLevelId,
    );
    const courseClassTemplates = classTemplatesJson.filter(
      (ct) => ct.courseId === course.id,
    );
    const classTemplatesClassesCountsMap = new Map();
    courseClassTemplates.forEach((cct) => {
      classTemplatesClassesCountsMap.set(
        cct.id,
        (classTemplatesClassesCountsMap.get(cct.id) ?? 0) + 1,
      );
    });

    let price = 0;
    if (!course.customPrice) {
      classTemplatesClassesCountsMap.forEach((v, k) => {
        price += v * classTemplatesJson.find((ct) => ct.id === k)!.price;
      });
    } else price = course.customPrice;

    const classTemplatesIds = courseClassTemplates.map((ct) => ct.id);

    const courseClasses = classesJson.filter((c) =>
      classTemplatesIds.includes(c.classTemplateId),
    );

    const maxDate = new Date(8640000000000000);

    const startDate = new Date(
      courseClasses.reduce(
        (acc, cur) =>
          new Date(cur.startDate) < new Date(acc) ? cur.startDate : acc,
        String(maxDate),
      ),
    );

    const minDate = new Date(8640000000000000);

    const endDate = new Date(
      courseClasses.reduce(
        (acc, cur) =>
          new Date(cur.endDate) > new Date(acc) ? cur.endDate : acc,
        String(minDate),
      ),
    );

    const doc: CourseDocument = {
      name: course.name,
      description: course.description,
      descriptionEmbedded: descEmbedded,
      danceCategory: danceCategory
        ? {
            id: danceCategory?.id,
            name: danceCategory?.name,
            description: danceCategory?.description,
          }
        : null,
      advancementLevel: advancementLevel
        ? {
            id: advancementLevel.id,
            name: advancementLevel.name,
            description: advancementLevel.description,
          }
        : null,
      price,
      startDate,
      endDate,
    };
    await esClient.index({
      index: "courses",
      id: String(course.id),
      document: doc,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(`Error while seeding: ${e}`);
    await prisma.$disconnect();
    process.exit(1);
  });
