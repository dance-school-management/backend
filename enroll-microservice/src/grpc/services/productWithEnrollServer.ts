import { IProductWithEnrollServer } from "../../../proto/productCommunication_grpc_pb";
import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import prisma from "../../utils/prisma";
import {
  ClassIdsRequest,
  EnrollInstructorsInClassRequest,
  EnrollInstructorsInClassResponse,
  InstructorClass,
  InstructorIdsRequest,
  InstructorsClassesResponse,
  StudentClass,
  StudentsClassesResponse,
} from "../../../proto/productCommunication_pb";
import { UniversalError } from "../../errors/UniversalError";
import { StatusCodes } from "http-status-codes";

export const ProductWithEnrollServerImp: IProductWithEnrollServer = {
  async getInstructorsClasses(
    call: ServerUnaryCall<InstructorIdsRequest, InstructorsClassesResponse>,
    callback: sendUnaryData<InstructorsClassesResponse>,
  ): Promise<void> {
    const instructorIds = call.request.getInstructorIdsList();

    const instructorsClasses = await prisma.classesOnInstructors.findMany({
      where: {
        instructorId: {
          in: instructorIds,
        },
      },
    });
    const instructorsClassesProtobuf: InstructorClass[] =
      instructorsClasses.map((item) => {
        const ic = new InstructorClass();
        ic.setClassId(item.classId);
        ic.setIntructorId(item.instructorId);
        return ic;
      });

    const res = new InstructorsClassesResponse().setInstructorsClassesIdsList(
      instructorsClassesProtobuf,
    );
    callback(null, res);
  },
  async getClassesInstructors(
    call: ServerUnaryCall<ClassIdsRequest, InstructorsClassesResponse>,
    callback: sendUnaryData<InstructorsClassesResponse>,
  ): Promise<void> {
    const classIds = call.request.getClassIdsList();

    const classesInstructors = await prisma.classesOnInstructors.findMany({
      where: {
        classId: {
          in: classIds,
        },
      },
    });

    const classesInstructorsProtobuf: InstructorClass[] =
      classesInstructors.map((item) => {
        const ic = new InstructorClass();
        ic.setClassId(item.classId);
        ic.setIntructorId(item.instructorId);
        return ic;
      });

    const res = new InstructorsClassesResponse().setInstructorsClassesIdsList(
      classesInstructorsProtobuf,
    );
    callback(null, res);
  },
  async enrollInstructorsInClass(
    call: ServerUnaryCall<
      EnrollInstructorsInClassRequest,
      EnrollInstructorsInClassResponse
    >,
    callback: sendUnaryData<EnrollInstructorsInClassResponse>,
  ): Promise<void> {
    const classId = call.request.getClassId();
    const instructorIds = call.request.getInstructorIdsList();

    const classes = await prisma.classesOnInstructors.createMany({
      data: instructorIds.map((instructorId) => ({
        classId,
        instructorId,
      })),
    });

    if (!classes) {
      const err = new UniversalError(
        StatusCodes.NOT_FOUND,
        "Error occured while creating classes-instructor enrollments",
        [],
      );
      callback({ code: status.NOT_FOUND, details: JSON.stringify(err) });
      return;
    }
    const res = new EnrollInstructorsInClassResponse().setSuccess(true);
    callback(null, res);
  },
  async getClassesStudents(
    call: ServerUnaryCall<ClassIdsRequest, StudentsClassesResponse>,
    callback: sendUnaryData<StudentsClassesResponse>,
  ): Promise<void> {
    const classIds = call.request.getClassIdsList()

    const classesStudents = await prisma.classTicket.findMany({
      where: {
        classId: {
          in: classIds,
        },
      },
    });

    const classesStudentsProtobuf: StudentClass[] =
      classesStudents.map((item) => {
        const ic = new StudentClass();
        ic.setClassId(item.classId);
        ic.setStudentId(item.studentId);
        return ic;
      });

    const res = new StudentsClassesResponse().setStudentsClassesIdsList(
      classesStudentsProtobuf,
    );
    callback(null, res);
  }
};
