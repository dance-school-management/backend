import {
  ClassIdsRequest,
  StudentClass,
  StudentsClassesResponse,
} from "../../../../proto/Messages_pb";
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import prisma from "../../../utils/prisma";

export async function getClassesStudents(
  call: ServerUnaryCall<ClassIdsRequest, StudentsClassesResponse>,
  callback: sendUnaryData<StudentsClassesResponse>,
): Promise<void> {
  const classIds = call.request.getClassIdsList();

  const classesStudents = await prisma.classTicket.findMany({
    where: {
      classId: {
        in: classIds,
      },
    },
  });

  const classesStudentsProtobuf: StudentClass[] = classesStudents.map(
    (item) => {
      const sc = new StudentClass();
      sc.setClassId(item.classId);
      sc.setStudentId(item.studentId);
      return sc;
    },
  );

  const res = new StudentsClassesResponse().setStudentsClassesIdsList(
    classesStudentsProtobuf,
  );
  callback(null, res);
}
