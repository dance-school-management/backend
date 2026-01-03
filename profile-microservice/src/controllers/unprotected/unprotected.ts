import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../../utils/prisma";
import { Profile, Role } from "../../../generated/client";
import { getDanceCategories } from "../../grpc/client/productCommunication/getDanceCategories";
import { getInstructorExperience } from "../../grpc/client/enrollCommunication/getInstructorExperience";
import { UniversalError } from "../../errors/UniversalError";
import { s3Endpoint } from "../../utils/aws-s3/s3Client";

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

  const instructorsWithPhotos = instructorsWithDanceCategoriesNames.map(
    (instructor) => ({
      ...instructor,
      photoPath: `${s3Endpoint}${instructor.photoPath}`,
    }),
  );

  const result = {
    instructors: instructorsWithPhotos,
  };

  res.status(StatusCodes.OK).json(result);
}

export async function getInstructor(
  req: Request<
    Profile,
    {},
    {},
    { experienceDateFrom: string; experienceDateTo: string }
  >,
  res: Response,
  next: NextFunction,
) {
  let instructor = await prisma.profile.findUnique({
    where: {
      id: req.params.id,
      role: Role.INSTRUCTOR,
    },
  });

  if (!instructor) {
    throw new UniversalError(StatusCodes.CONFLICT, "Instructor not found", []);
  }

  instructor = {
    ...instructor,
    photoPath: `${s3Endpoint}${instructor?.photoPath}`,
  };

  const timeSpentForEachDCAndAL = (
    await getInstructorExperience(
      instructor?.id,
      req.query.experienceDateFrom,
      req.query.experienceDateTo,
    )
  ).instructorExperienceList;

  const instructorWithExperience = {
    ...instructor,
    experience: [...new Set(timeSpentForEachDCAndAL)],
  };

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
