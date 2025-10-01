import { Request, Response } from "express";
import { UniversalError } from "../../errors/UniversalError";
import { StatusCodes } from "http-status-codes";
import prisma from "../../utils/prisma";
import { getCoursesClasses } from "../../grpc/client/productCommunication/getCoursesClasses";
import { AttendanceStatus } from "../../../generated/client";
import { getDanceCategoriesOfCourses } from "../../grpc/client/productCommunication/getDanceCategoriesOfCourses";
import {
  getSpentHoursDanceCategories,
  getSpentHoursInstructors,
} from "../../grpc/client/productCommunication/getSpentHours";
import { getInstructorsData } from "../../grpc/client/profileCommunication/getInstructorsData";

const MIN_ATTENDANCE_RATE_TO_PASS_COURSE = 0.5

export async function getLearntDanceCategories(
  req: Request<{}, {}, {}> & { user?: any },
  res: Response,
) {
  const studentId = req.user.id;
  if (!studentId) {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      "User id missing in request",
      [],
    );
  }

  const enrolledCoursesIds = (
    await prisma.courseTicket.findMany({
      where: {
        studentId,
      },
      select: {
        courseId: true,
      },
    })
  ).map((course) => course.courseId);

  // [{courseId: 1, classId: 2, classEndDate: Timestamp}, 
  // {courseId: 1, classId: 3, classEndDate: Timestamp}, 
  // {courseId: 2, classId: 5, classEndDate: Timestamp}, 
  // {courseId: 2, classId: 7, classEndDate: Timestamp}]
  // Returns, in the above form, all pairs of classIds that belong to enrolledCourseIds
  const coursesClassesResponse = (await getCoursesClasses(enrolledCoursesIds))
    .coursesClassesList;

  const coursesEndDatesMap = new Map();

  coursesClassesResponse.forEach((cc) => {
    if (
      !coursesEndDatesMap.get(cc.courseId) ||
      coursesEndDatesMap.get(cc.courseId) < cc.classEndDate.seconds
    ) {
      coursesEndDatesMap.set(cc.courseId, cc.classEndDate.seconds);
    }
  });

  const finishedCoursesIds = coursesClassesResponse
    .filter(
      (cc) => coursesEndDatesMap.get(cc.courseId) < new Date().getTime() / 1000,
    )
    .map((cc) => cc.courseId);

  const passedCoursesIds = [];

  const allAttendance = await prisma.classTicket.findMany({
    where: {
      classId: {
        in: [...new Set(coursesClassesResponse.map((cc) => cc.classId))],
      },
    },
  });

  for (const courseId of finishedCoursesIds) {
    const courseClassesIds = coursesClassesResponse
      .filter((cc) => cc.courseId === courseId)
      .map((cc) => cc.classId);

    const attendance = allAttendance.filter((aa) =>
      courseClassesIds.includes(aa.classId),
    );

    if (
      attendance.filter((a) => a.attendanceStatus === AttendanceStatus.PRESENT)
        .length >=
      MIN_ATTENDANCE_RATE_TO_PASS_COURSE * attendance.length
    ) {
      passedCoursesIds.push(courseId);
    }
  }

  const danceCategoriesOfCourses = (
    await getDanceCategoriesOfCourses(passedCoursesIds)
  ).danceCategoriesOfCoursesList;

  const withFinishedDate = danceCategoriesOfCourses.map((dcoc) => {
    return {
      ...dcoc,
      finishedDate: new Date(
        coursesClassesResponse
          .filter((cc) => cc.courseId === dcoc.courseId)
          .reduce((acc, cc) =>
            cc.classEndDate.seconds > acc.classEndDate.seconds ? cc : acc,
          ).classEndDate.seconds * 1000,
      ),
    };
  });

  const instructorIds = await prisma.classesOnInstructors.findMany({
    where: {
      classId: {
        in: coursesClassesResponse.map((ccr) => ccr.classId),
      },
    },
    select: {
      instructorId: true,
      classId: true,
    },
  });

  const instructorsData = (
    await getInstructorsData(instructorIds.map((i) => i.instructorId))
  ).instructorsDataList;

  const withInstructors = withFinishedDate.map((item) => {
    const iids = instructorIds
      .filter((ii) =>
        coursesClassesResponse
          .filter((ccr) => ccr.courseId === item.courseId)
          .map((ccr) => ccr.classId)
          .includes(ii.classId),
      )
      .map((ii) => ii.instructorId);
    const instructors = instructorsData.filter((ii) =>
      iids.includes(ii.instructorId),
    );
    return {
      ...item,
      instructorsNames: instructors.map(
        (ii) => ii.instructorName + " " + ii.instructorSurname,
      ),
    };
  });

  res.status(StatusCodes.OK).json(withInstructors);
}

export async function getCoursesAttendanceProgress(
  req: Request<{}, {}, {}> & { user?: any },
  res: Response,
) {
  const studentId = req.user.id;
  if (!studentId) {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      "User id missing in request",
      [],
    );
  }

  const enrolledCoursesIds = (
    await prisma.courseTicket.findMany({
      where: {
        studentId,
      },
      select: {
        courseId: true,
      },
    })
  ).map((course) => course.courseId);

  const coursesClassesRes = (await getCoursesClasses(enrolledCoursesIds))
    .coursesClassesList;

  const coursesEndDatesMap = new Map();

  coursesClassesRes.forEach((cc) => {
    if (
      !coursesEndDatesMap.get(cc.courseId) ||
      coursesEndDatesMap.get(cc.courseId) < cc.classEndDate.seconds
    ) {
      coursesEndDatesMap.set(cc.courseId, cc.classEndDate.seconds);
    }
  });

  const coursesClasses = coursesClassesRes.filter(
    (cc) => coursesEndDatesMap.get(cc.courseId) > new Date().getTime() / 1000,
  );

  const enrolledClassesInstructors = await prisma.classesOnInstructors.findMany(
    {
      where: {
        classId: {
          in: coursesClasses.map((cc) => cc.classId),
        },
      },
    },
  );

  const coursesClassesInstructors = coursesClasses.map((cc) => ({
    classId: cc.classId,
    courseId: cc.courseId,
    instructorIds: enrolledClassesInstructors
      .filter((eci) => eci.classId === cc.classId)
      .map((eci) => eci.instructorId),
  }));

  const instructorsDataResponse = (
    await getInstructorsData(
      enrolledClassesInstructors.map((eci) => eci.instructorId),
    )
  ).instructorsDataList;

  const enrolledCoursesInstructors = instructorsDataResponse.map((iid) => {
    return {
      instructorId: iid.instructorId,
      courseId: coursesClassesInstructors.find((cci) =>
        cci.instructorIds.includes(iid.instructorId),
      )?.courseId,
    };
  });

  const coursesInstructors = instructorsDataResponse.map((idr) => ({
    courseId: enrolledCoursesInstructors.find(
      (eci) => eci.instructorId === idr.instructorId,
    )?.courseId,
    instructorName: idr.instructorName + " " + idr.instructorSurname,
  }));

  const coursesClassesResponse = (await getCoursesClasses(enrolledCoursesIds))
    .coursesClassesList;

  const attendanceRatios = [];

  for (const courseId of [
    ...new Set(coursesClasses.map((cc) => cc.courseId)),
  ]) {
    const coursesClasses = coursesClassesResponse.filter(
      (courseClassId) => courseClassId.courseId === courseId,
    );

    const courseClassesIds = coursesClasses.map(
      (courseClassId) => courseClassId.classId,
    );

    const attendedCount = await prisma.classTicket.count({
      where: {
        classId: {
          in: courseClassesIds,
        },
        studentId,
        attendanceStatus: AttendanceStatus.PRESENT,
      },
    });

    const coursesClassesStartDatesMap = new Map();

    coursesClasses.forEach((cc) => {
      if (
        !coursesClassesStartDatesMap ||
        coursesClassesStartDatesMap.get(cc.courseId) > cc.classStartDate.seconds
      ) {
        coursesClassesStartDatesMap.set(cc.courseId, cc.classStartDate.seconds);
      }
    });

    

    const hasStarted = Boolean(
      [...coursesClassesStartDatesMap.values()].find(
        (classStartTime) => classStartTime < (new Date()).getTime() / 1000,
      ),
    );

    attendanceRatios.push({
      courseId: courseId,
      courseName: coursesClassesResponse.find(
        (courseClassId) => courseClassId.courseId === courseId,
      )?.courseName,
      hasStarted,
      instructorsNames: coursesInstructors
        .filter((ci) => ci.courseId === courseId)
        .map((ci) => ci.instructorName),
      attendedCount: attendedCount,
      allCount: courseClassesIds.length,
    });
  }

  res.status(200).json({ courseAttendancesRates: attendanceRatios });
}

export async function getHoursSpentDanceCategories(
  req: Request<{}, {}, {}> & { user?: any },
  res: Response,
) {
  const studentId = req.user.id;
  if (!studentId) {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      "User id missing in request",
      [],
    );
  }

  const studentAttendedClasses = await prisma.classTicket.findMany({
    where: {
      studentId,
      attendanceStatus: AttendanceStatus.PRESENT,
    },
  });

  const attendedClassesIds = [
    ...new Set(studentAttendedClasses.map((sac) => sac.classId)),
  ];

  const spentHours = (
    await getSpentHoursDanceCategories(attendedClassesIds)
  ).spentHoursStatsList.map((shsl) => ({
    danceCategoryName: shsl.danceCategoryName,
    spentHours: shsl.spentHours,
  }));

  res.status(StatusCodes.OK).json({ spentHoursStatsList: spentHours });
}

export async function getHoursSpentInstructors(
  req: Request<{}, {}, {}> & { user?: any },
  res: Response,
) {
  const studentId = req.user.id;
  if (!studentId) {
    throw new UniversalError(
      StatusCodes.BAD_REQUEST,
      "User id missing in request",
      [],
    );
  }

  const enrolledClasses = await prisma.classTicket.findMany({
    where: {
      studentId,
      attendanceStatus: AttendanceStatus.PRESENT,
    },
  });

  const enrolledClassesIds = enrolledClasses.map((ec) => ec.classId);

  const instructorsClasses = await prisma.classesOnInstructors.findMany({
    where: {
      classId: {
        in: enrolledClassesIds,
      },
    },
    select: {
      instructorId: true,
      classId: true,
    },
  });

  const instructorsClassesIds = instructorsClasses.map((ic) => ({
    instructorId: ic.instructorId,
    classId: ic.classId,
  }));

  const spentHours = await getSpentHoursInstructors(instructorsClassesIds);

  const instructorsIds = instructorsClassesIds.map((ici) => ici.instructorId);

  const instructorsData = (await getInstructorsData(instructorsIds))
    .instructorsDataList;

  const result = spentHours.spentHoursStatsList.map((sh) => {
    const instructor = instructorsData.find(
      (iid) => iid.instructorId === sh.instructorId,
    );
    return {
      instructorFirstname: instructor?.instructorName,
      instructorSurname: instructor?.instructorSurname,
      spentHours: sh.spentHours,
    };
  });

  res.status(StatusCodes.OK).json({ spentHoursStatsList: result });
}

export async function favouriteDanceCategories(
  req: Request<{}, {}, {}> & { user?: any },
  res: Response,
) {}
