import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import {
  DanceCategorySpentHours,
  GetSpentHoursDanceCategoriesRequest,
  GetSpentHoursDanceCategoriesResponse,
  GetSpentHoursInstructorsRequest,
  GetSpentHoursInstructorsResponse,
  InstructorSpentHours,
} from "../../../../proto/EnrollToProductMessages_pb";
import prisma from "../../../utils/prisma";

export async function getSpentHoursDanceCategories(
  call: ServerUnaryCall<
    GetSpentHoursDanceCategoriesRequest,
    GetSpentHoursDanceCategoriesResponse
  >,
  callback: sendUnaryData<GetSpentHoursDanceCategoriesResponse>,
): Promise<void> {
  const attendedClassesIds = call.request.getAttendedClassesIdsList();

  const classesData = await prisma.class.findMany({
    where: {
      id: {
        in: attendedClassesIds,
      },
    },
    include: {
      classTemplate: {
        include: {
          course: {
            include: {
              danceCategory: true,
            },
          },
          danceCategory: true,
        },
      },
    },
  });

  const danceCategorySpentHoursMap = new Map();

  classesData.map((cd) => {
    let danceCategoryId = null;
    let danceCategoryName = null;
    if (cd.classTemplate.course?.danceCategory) {
      danceCategoryId = cd.classTemplate.course.danceCategoryId;
      danceCategoryName = cd.classTemplate.course.danceCategory?.name;
    } else if (cd.classTemplate.danceCategory) {
      danceCategoryId = cd.classTemplate.danceCategoryId;
      danceCategoryName = cd.classTemplate.danceCategory?.name;
    }

    const classSpentHours =
      (cd.endDate.getTime() - cd.startDate.getTime()) / (1000 * 3600);

    danceCategorySpentHoursMap.set(
      danceCategoryName,
      (danceCategorySpentHoursMap.get(danceCategoryName) || 0) +
        classSpentHours,
    );
  });

  const spentHours = [...danceCategorySpentHoursMap.keys()].map((dcn) => {
    const val = new DanceCategorySpentHours();
    val.setDanceCategoryName(dcn);
    val.setSpentHours(danceCategorySpentHoursMap.get(dcn));
    return val;
  });

  const res = new GetSpentHoursDanceCategoriesResponse();
  res.setSpentHoursStatsList(spentHours);

  callback(null, res);
}

export async function getSpentHoursInstructors(
  call: ServerUnaryCall<
    GetSpentHoursInstructorsRequest,
    GetSpentHoursInstructorsResponse
  >,
  callback: sendUnaryData<GetSpentHoursInstructorsResponse>,
): Promise<void> {
  const classesInstructorsIds = call.request.getClassesInstructorsIdsList();

  const classesIds = classesInstructorsIds.map((cii) => cii.getClassId());

  const classes = await prisma.class.findMany({
    where: {
      id: {
        in: classesIds,
      },
    },
  });

  const classesSpentHours = classes.map((cl) => ({
    instructorId: classesInstructorsIds.find((cii) => cii.getClassId() === cl.id)?.getInstructorId(),
    classId: cl.id,
    spentHours: Number(
      ((cl.endDate.getTime() - cl.startDate.getTime()) / (1000 * 3600)).toFixed(
        2,
      ),
    ),
  }));

  const instructorsIds = [
    ...new Set(classesInstructorsIds.map((cii) => cii.getInstructorId())),
  ];

  const result = instructorsIds.map((ii) => {
    const instructorSpentHours = classesSpentHours.filter((csh) => csh.instructorId === ii).reduce(
      (acc, cur) => acc + cur.spentHours,
      0,
    );
    const r = new InstructorSpentHours()
      .setInstructorId(ii)
      .setSpentHours(instructorSpentHours);

    return r;
  });

  const resultProtobuf =
    new GetSpentHoursInstructorsResponse().setSpentHoursStatsList(result);

  callback(null, resultProtobuf)
}
