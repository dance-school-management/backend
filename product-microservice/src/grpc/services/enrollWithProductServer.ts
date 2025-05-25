import { IEnrollWithProductServer } from "../../../proto/productCommunication_grpc_pb";
import {
  CheckClassRequest,
  CheckCourseRequest,
  CheckCourseResponse,
  CheckCourseResponseEntry,
  CheckResponse,
  ClassDetails,
  ClassesDetailsResponse,
  ClassIdsRequest,
} from "../../../proto/productCommunication_pb";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import prisma from "../../utils/prisma";
import { UniversalError } from "../../errors/UniversalError";
import { StatusCodes } from "http-status-codes";
import { ClassType } from "../../../generated/client";

export const EnrollWithProductServerImp: IEnrollWithProductServer = {
  async checkClass(
    call: ServerUnaryCall<CheckClassRequest, CheckResponse>,
    callback: sendUnaryData<CheckResponse>,
  ): Promise<void> {
    const classId = call.request.getClassId();
    const classObj = await prisma.class.findFirst({
      where: {
        id: classId,
        classTemplate: {
          classType: {
            in: [ClassType.PRIVATE_CLASS, ClassType.THEME_PARTY],
          },
        },
      },
    });
    if (!classObj) {
      const err = new UniversalError(
        StatusCodes.NOT_FOUND,
        `This class with id ${classId} doesn't exists or is part of a course`,
        [],
      );
      callback({ code: status.NOT_FOUND, details: JSON.stringify(err) });
      return;
    }
    const res = new CheckResponse().setPeopleLimit(classObj.peopleLimit);
    callback(null, res);
  },
  async checkCourse(
    call: ServerUnaryCall<CheckCourseRequest, CheckCourseResponse>,
    callback: sendUnaryData<CheckCourseResponse>,
  ): Promise<void> {
    const courseId = call.request.getCourseId();
    const groupNumber = call.request.getGroupNumber();
    // const courseObj = await prisma.course.findFirst({
    //   where: {
    //     id: courseId,
    //   },
    // });

    const classesWithPeopleLimites = await prisma.classTemplate.findMany({
      where: {
        courseId: courseId,
      },
      select: {
        class: {
          select: {
            id: true,
            peopleLimit: true,
          },
          where: {
            groupNumber,
          },
        },
      },
    });

    if (!classesWithPeopleLimites) {
      const err = new UniversalError(
        StatusCodes.NOT_FOUND,
        `This course with id ${courseId} doesn't exists`,
        [],
      );
      callback({ code: status.NOT_FOUND, details: JSON.stringify(err) });
      return;
    }
    if (classesWithPeopleLimites.length === 0) {
      const err = new UniversalError(
        StatusCodes.NOT_FOUND,
        `This course with id ${courseId} doesn't have class_templates with group number ${groupNumber}`,
        [],
      );
      callback({ code: status.NOT_FOUND, details: JSON.stringify(err) });
    }
    classesWithPeopleLimites.forEach((classWithPeopleLimit) => {
      if (classWithPeopleLimit.class.length !== 1) {
        const err = new UniversalError(
          StatusCodes.NOT_FOUND,
          `This course with id ${courseId} doesn't have complete set of classes with group number ${groupNumber}`,
          [],
        );
        callback({ code: status.NOT_FOUND, details: JSON.stringify(err) });
      }
    });

    const res = new CheckCourseResponse().setPeopleLimitsList(
      classesWithPeopleLimites
        .flatMap((classWithPeopleLimit) => classWithPeopleLimit.class)
        .map((classObj) => {
          const entry = new CheckCourseResponseEntry();
          entry.setClassId(classObj.id);
          entry.setPeopleLimit(classObj.peopleLimit);
          return entry;
        }),
    );
    callback(null, res);
  },
  async getClassesDetails(
    call: ServerUnaryCall<ClassIdsRequest, ClassesDetailsResponse>,
    callback: sendUnaryData<ClassesDetailsResponse>,
  ): Promise<void> {
    const classIds = call.request.getClassIdsList();

    const classesDetails = await prisma.class.findMany({
      where: {
        id: {
          in: classIds,
        },
      },
      include: {
        classTemplate: {
          include: {
            danceCategory: true,
            advancementLevel: true
          }
        },
        classRoom: true,
      },
    });

    const classesDetailsProtobuf = classesDetails.map(
      (classDetails) => {
        const cbd = new ClassDetails();
        cbd.setClassId(classDetails.id);
        cbd.setName(classDetails.classTemplate.name);
        cbd.setStartDate(classDetails.startDate.toISOString());
        cbd.setEndDate(classDetails.endDate.toISOString());
        cbd.setClassRoomName(classDetails.classRoom.name);
        if (classDetails.classTemplate.danceCategory)
          cbd.setDanceCategoryName(classDetails.classTemplate.danceCategory.name);
        if (classDetails.classTemplate.advancementLevel)
          cbd.setAdvancementLevelName(classDetails.classTemplate.advancementLevel?.name)
        cbd.setDescription(classDetails.classTemplate.description);
        return cbd;
      },
    );

    const res = new ClassesDetailsResponse();
    res.setClassesdetailsList(classesDetailsProtobuf);
    callback(null, res);
  },
};
