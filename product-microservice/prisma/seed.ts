import {
  ClassStatus,
  ClassType,
  CourseStatus,
  PrismaClient,
} from "../generated/client";
import danceCategoriesJson from "../../data/product/danceCategories.json";
import danceCategoriesGeminiJson from "../../data/product/danceCategoriesGemini.json";
import advancementLevelsJson from "../../data/product/advancementLevels.json";
import classRoomsJson from "../../data/product/classRooms.json";
import coursesJson from "../../data/product/courses.json";
import classTemplatesJson from "../../data/product/classTemplates.json";
import classTemplatesGeminiJson from "../../data/product/classTemplatesGemini.json";
import classesJson from "../../data/product/classes.json";
import logger from "../src/utils/winston";
import {
  ClassTemplateDocument,
  CourseDocument,
  esClient,
} from "../src/elasticsearch/client";
import { embed } from "../src/grpc/client/aiCommunication/embed";
import "dotenv/config";
import { getClassesInstructors } from "../src/grpc/client/enrollCommunication/getClassesInstructors";
import { enrollInstructorsInClass } from "../src/grpc/client/enrollCommunication/enrollInstructorsInClass";

const prisma = new PrismaClient();

const INSTRUCTOR_IDS: string[] = Array.from({ length: 20 }, (_, i) =>
  (11 + i).toString(),
); // ["11", "12", ..., "30"]

async function generateDanceClasses() {
  const classTemplateIds = Array.from({ length: 10 }, (_, i) => i + 25);

  const allClassRoomIds = classRoomsJson.map((room) => room.id);

  const startTimespan = new Date("2025-11-01T12:00:00");
  const endTimespan = new Date("2026-05-01T12:00:00");
  const classesPerWeek = 28;

  const CLASS_DURATION_MS = 90 * 60 * 1000;
  const MAX_RETRIES = 5;

  let currentWeekStart = new Date(startTimespan);
  let currentWeekEnd = new Date(startTimespan);
  currentWeekEnd.setDate(currentWeekEnd.getDate() + 7);

  let totalClassesCreated = 0;

  while (currentWeekEnd.getTime() <= endTimespan.getTime()) {
    const daysInCurrentWeek = 7;

    for (let i = 0; i < classesPerWeek; i++) {
      let slotFound = false; // Zmieniono nazwę na slotFound
      let retryCount = 0;

      while (!slotFound && retryCount < MAX_RETRIES) {
        const dayOffset = Math.floor(Math.random() * daysInCurrentWeek);

        const earliestPossibleClassStartDate = new Date(currentWeekStart);
        earliestPossibleClassStartDate.setDate(
          currentWeekStart.getDate() + dayOffset,
        );
        earliestPossibleClassStartDate.setHours(8, 0, 0, 0);

        const latestPossibleClassStartDate = new Date(
          earliestPossibleClassStartDate,
        );
        latestPossibleClassStartDate.setHours(21, 0, 0, 0);

        const classStartDate = generateRandomDateRoundedToHalfHour(
          earliestPossibleClassStartDate,
          latestPossibleClassStartDate,
        );

        const classEndDate = new Date(classStartDate);
        classEndDate.setTime(classEndDate.getTime() + CLASS_DURATION_MS);

        // --- Walidacja Kolizji Sali I Instruktora ---
        const availableSlot = await findAvailableSlot(
          classStartDate,
          classEndDate,
          allClassRoomIds,
          INSTRUCTOR_IDS, // Dodano pulę instruktorów
        );

        if (availableSlot !== null) {
          const randomIndex = Math.floor(
            Math.random() * classTemplateIds.length,
          );
          const randomTemplateId = classTemplateIds[randomIndex];

          try {
            // 1. Utwórz zajęcia w bazie
            const createdClass = await prisma.class.create({
              data: {
                startDate: classStartDate,
                endDate: classEndDate,
                classStatus: ClassStatus.NORMAL,
                peopleLimit: Math.floor(Math.random() * 5) + 2,
                classRoomId: availableSlot.classRoomId, // Użyj wolnej sali
                classTemplateId: randomTemplateId,
              },
            });

            // 2. Przypisz instruktora przez gRPC
            await enrollInstructorsInClass(
              createdClass.id,
              [availableSlot.instructorId], // Przypisujemy jednego wolnego instruktora
            );

            totalClassesCreated++;
            slotFound = true; // Zakończ pętlę while
          } catch (e) {
            console.error("Error creating classes or enrolling instructor:", e);
            slotFound = true; // Zakończ próbę z powodu błędu Prisma/gRPC
          }
        } else {
          retryCount++;
        }
      }

      if (!slotFound) {
        console.warn(
          `Skipped class (Week ${currentWeekStart.toISOString().slice(0, 10)}) after ${MAX_RETRIES} retries - no free slot (room or instructor) found.`,
        );
      }
    }

    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 7);
  }

  console.log(
    `\n🎉 Successfully created ${totalClassesCreated} classes in the schedule.`,
  );
}

function generateRandomDateRoundedToHalfHour(start: Date, end: Date): Date {
  const startTime = start.getTime();
  const endTime = end.getTime();

  const randomTime = startTime + Math.random() * (endTime - startTime);

  const HALF_HOUR_MS = 30 * 60 * 1000;

  const roundedTime = Math.round(randomTime / HALF_HOUR_MS) * HALF_HOUR_MS;

  if (roundedTime > endTime) {
    const lastValidHalfHour = Math.floor(endTime / HALF_HOUR_MS) * HALF_HOUR_MS;
    return new Date(lastValidHalfHour);
  }

  return new Date(roundedTime);
}

async function findAvailableSlot(
  startDate: Date,
  endDate: Date,
  allClassRoomIds: number[],
  allInstructorIds: string[],
): Promise<{ classRoomId: number; instructorId: string } | null> {
  // 1. Find all classes conflicting with the proposed time slot
  const conflictingClasses = await prisma.class.findMany({
    where: {
      OR: [
        {
          startDate: { lt: endDate },
          endDate: { gt: startDate },
        },
      ],
    },
    select: {
      id: true,
      classRoomId: true,
    },
  });

  // Collect IDs of occupied rooms
  const occupiedRoomIds = conflictingClasses
    .map((c) => c.classRoomId)
    .filter((id) => id !== null) as number[];

  // Find available rooms
  const availableRoomIds = allClassRoomIds.filter(
    (id) => !occupiedRoomIds.includes(id),
  );

  // 2. Find occupied instructors
  const conflictingClassIds = conflictingClasses.map((c) => c.id);
  // POBRANIE HARMONOGRAMU INSTRUKTORÓW DLA ZAJĘĆ, KTÓRE KOLIDUJĄ CZASOWO
  const instructorsInConflictingClasses = (
    await getClassesInstructors(conflictingClassIds)
  ).instructorsClassesIdsList;

  const occupiedInstructorIds = instructorsInConflictingClasses.map(
    (a) => a.instructorId,
  );

  // Find available instructors
  const availableInstructorIds = allInstructorIds.filter(
    (id) => !occupiedInstructorIds.includes(id),
  );

  // 3. Select a random available room AND instructor
  if (availableRoomIds.length > 0 && availableInstructorIds.length > 0) {
    const randomRoomIndex = Math.floor(Math.random() * availableRoomIds.length);
    const randomInstructorIndex = Math.floor(
      Math.random() * availableInstructorIds.length,
    );

    return {
      classRoomId: availableRoomIds[randomRoomIndex]!,
      instructorId: availableInstructorIds[randomInstructorIndex]!,
    };
  }

  return null; // No available slot found (either room or instructor)
}

async function main() {
  for (const danceCategory of danceCategoriesJson.concat(
    danceCategoriesGeminiJson,
  )) {
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
          price: course.customPrice,
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

  for (const classTemplate of classTemplatesJson.concat(
    classTemplatesGeminiJson,
  )) {
    try {
      await prisma.classTemplate.upsert({
        where: {
          id: classTemplate.id,
        },
        update: {},
        create: {
          classType: classTemplate.classType as ClassType,
          description: classTemplate.description,
          name: classTemplate.name,
          price: classTemplate.price,
          advancementLevelId: classTemplate.advancementLevelId,
          courseId: classTemplate.courseId,
          danceCategoryId: classTemplate.danceCategoryId,
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

  await esClient.indices.create({
    index: "courses",
    mappings: {
      properties: {
        startDate: {
          type: "date",
          format: "strict_date_optional_time||epoch_millis",
        },
        endDate: {
          type: "date",
          format: "strict_date_optional_time||epoch_millis",
        },
      },
    },
  });

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

    const price = course.customPrice;

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

    const minDate = new Date(0);

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
    try {
      await generateDanceClasses();
    } catch (err) {
      console.error(
        `Error generating classes and class templates with Gemini: ${err}`,
      );
    }
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
