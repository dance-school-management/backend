import {
  ClassStatus,
  ClassType,
  CourseStatus,
  PrismaClient,
} from "../generated/client";
import danceCategoriesJson from "../../data/product/danceCategories.json";
import danceCategoriesGeminiJson from "../../data/product/danceCategoriesGemini.json";
import danceCategoriesForCoursesGeminiJson from "../../data/product/danceCategoriesForCoursesGemini.json";
import advancementLevelsJson from "../../data/product/advancementLevels.json";
import classRoomsJson from "../../data/product/classRooms.json";
import coursesJson from "../../data/product/courses.json";
import coursesGeminiJson from "../../data/product/coursesGemini.json";
import classTemplatesJson from "../../data/product/classTemplates.json";
import classTemplatesGeminiJson from "../../data/product/classTemplatesGemini.json";
import classTemplatesForCoursesGeminiJson from "../../data/product/classTemplatesForCoursesGemini.json";
import classesJson from "../../data/product/classes.json";
import logger from "../src/utils/winston";
import "dotenv/config";
import { getClassesInstructors } from "../src/grpc/client/enrollCommunication/getClassesInstructors";
import { enrollInstructorsInClass } from "../src/grpc/client/enrollCommunication/enrollInstructorsInClass";

const prisma = new PrismaClient();

const INSTRUCTOR_IDS: string[] = Array.from({ length: 20 }, (_, i) =>
  (11 + i).toString(),
); // ["11", "12", ..., "30"]

async function generateDanceClassesWithoutCourses() {
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

async function generateDanceClassesWithCourses() {
  const classTemplateIds = Array.from({ length: 20 }, (_, i) => i + 35);
  const allClassRoomIds = classRoomsJson.map((room) => room.id);

  const startTimespan = new Date("2026-02-10T12:00:00");
  const endTimespan = new Date("2026-12-20T12:00:00");

  const classesPerMonthPerCourse = 4;
  const CLASS_DURATION_MS = 90 * 60 * 1000;
  const MAX_RETRIES = 10; // Increased retries as schedule gets tighter

  let totalClassesCreated = 0;

  // Iterate over each course template (assuming each template = distinct course)
  for (const templateId of classTemplateIds) {
    let currentMonthStart = new Date(startTimespan);

    while (currentMonthStart.getTime() < endTimespan.getTime()) {
      // Define the boundary for the current month segment
      const currentMonthEnd = new Date(currentMonthStart);
      currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1);

      // Ensure we don't generate classes beyond the global endTimespan
      const generationEndBoundary =
        currentMonthEnd.getTime() > endTimespan.getTime()
          ? endTimespan
          : currentMonthEnd;

      for (let i = 0; i < classesPerMonthPerCourse; i++) {
        let slotFound = false;
        let retryCount = 0;

        while (!slotFound && retryCount < MAX_RETRIES) {
          // Generate a random date within the current month/segment
          const randomDateInRange = new Date(
            currentMonthStart.getTime() +
              Math.random() *
                (generationEndBoundary.getTime() - currentMonthStart.getTime()),
          );

          // Set constraints for the class hours (e.g., 08:00 - 21:00)
          const classStartDate = generateRandomDateRoundedToHalfHour(
            randomDateInRange,
            randomDateInRange,
          );
          classStartDate.setHours(
            Math.floor(Math.random() * (21 - 8 + 1)) + 8,
            0,
            0,
            0,
          );

          const classEndDate = new Date(classStartDate);
          classEndDate.setTime(classEndDate.getTime() + CLASS_DURATION_MS);

          // Validate room and instructor availability
          const availableSlot = await findAvailableSlot(
            classStartDate,
            classEndDate,
            allClassRoomIds,
            INSTRUCTOR_IDS,
          );

          if (availableSlot !== null) {
            try {
              // 1. Create class in the database
              const createdClass = await prisma.class.create({
                data: {
                  startDate: classStartDate,
                  endDate: classEndDate,
                  classStatus: ClassStatus.NORMAL,
                  peopleLimit: Math.floor(Math.random() * 10) + 10, // Courses usually have higher limits
                  classRoomId: availableSlot.classRoomId,
                  classTemplateId: templateId,
                },
              });

              // 2. Assign instructor via gRPC
              await enrollInstructorsInClass(createdClass.id, [
                availableSlot.instructorId,
              ]);

              totalClassesCreated++;
              slotFound = true;
            } catch (e) {
              console.error(
                `Error creating course class for template ${templateId}:`,
                e,
              );
              slotFound = true; // Stop retries for this instance on fatal error
            }
          } else {
            retryCount++;
          }
        }

        if (!slotFound) {
          console.warn(
            `Skipped class for template ${templateId} in period starting ${currentMonthStart.toISOString().slice(0, 7)} - no free slot found.`,
          );
        }
      }

      // Move cursor to the next month
      currentMonthStart.setMonth(currentMonthStart.getMonth() + 1);
    }
  }

  console.log(
    `\n🎉 Successfully created ${totalClassesCreated} course-based classes in the schedule.`,
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
  for (const danceCategory of danceCategoriesJson
    .concat(danceCategoriesGeminiJson)
    .concat(danceCategoriesForCoursesGeminiJson)) {
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

  for (const course of coursesJson.concat(coursesGeminiJson)) {
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
      // logger.error(
      //   `Error upserting course with id ${course.id}\n error: ${error}`,
      // );
    }
  }

  for (const classTemplate of classTemplatesJson
    .concat(classTemplatesGeminiJson)
    .concat(classTemplatesForCoursesGeminiJson)) {
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
      // logger.error(
      //   `Error upserting classTemplate with id ${classTemplate.id} \n error: ${error}`,
      // );
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
      // logger.error(
      //   `Error upserting class with id ${aClass.id} \n error: ${error}`,
      // );
    }
  }

  try {
    await generateDanceClassesWithoutCourses();
    await generateDanceClassesWithCourses();
  } catch (err) {
    console.error(
      `Error generating classes and class templates with Gemini: ${err}`,
    );
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
