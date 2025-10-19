import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../utils/prisma";
import { Profile, Role } from "../../../generated/client";
import { getDanceCategories } from "../../grpc/client/productCommunication/getDanceCategories";
import { getInstructorExperience } from "../../grpc/client/enrollCommunication/getInstructorExperience";
import { UniversalError } from "../../errors/UniversalError";

export async function getAllInstructors(
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction,
) {
  const allInstructors = await prisma.profile.findMany({
    where: {
      role: Role.INSTRUCTOR,
    },
  });

  const danceCategoriesIds = Array.from(
    new Set(
      allInstructors.flatMap(
        (instructor) => instructor.favouriteDanceCategories || [],
      ),
    ),
  );

  const danceCategoriesEntries = (await getDanceCategories(danceCategoriesIds))
    .danceCategoriesList;

  const instructorsWithDanceCategoriesNames = allInstructors.map(
    (instructor) => ({
      ...instructor,
      favouriteDanceCategories: instructor.favouriteDanceCategories.map(
        (favId) => {
          return (
            danceCategoriesEntries.find(
              (danceCategory) => danceCategory.id === favId,
            )?.name || ""
          );
        },
      ),
    }),
  );

  const result = {
    instructors: instructorsWithDanceCategoriesNames,
  };

  res.status(StatusCodes.OK).json(result);
}

export async function getInstructor(
  req: Request<Profile>,
  res: Response,
  next: NextFunction,
) {
  const instructor = await prisma.profile.findUnique({
    where: {
      id: req.params.id,
      role: Role.INSTRUCTOR,
    },
  });

  if (!instructor) {
    throw new UniversalError(StatusCodes.CONFLICT, "Instructor not found", []);
  }

  const timeSpentForEachDCAndAL = (await getInstructorExperience(instructor?.id)).instructorExperienceList;

  const instructorWithExperience = {
    ...instructor,
    experience: [...new Set(timeSpentForEachDCAndAL)]
  }

  if (
    instructor?.favouriteDanceCategories &&
    instructor.favouriteDanceCategories.length > 0
  ) {
    const danceCategoriesEntries = (
      await getDanceCategories(instructor?.favouriteDanceCategories)
    ).danceCategoriesList;
    const instructorWithDanceCategoriesNames = {
      ...instructorWithExperience,
      favouriteDanceCategories: instructor.favouriteDanceCategories.map(
        (favId) =>
          danceCategoriesEntries.find(
            (danceCategory) => danceCategory.id === favId,
          )?.name || "",
      ),
    };
    res.status(StatusCodes.OK).json(instructorWithDanceCategoriesNames);
    return;
  }
  res.status(StatusCodes.OK).json(instructor);
}
