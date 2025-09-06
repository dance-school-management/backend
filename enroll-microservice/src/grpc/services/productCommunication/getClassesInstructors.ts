import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import {
  ClassIdsRequest,
  InstructorClass,
  InstructorsClassesResponse,
} from "../../../../proto/Messages_pb";
import prisma from "../../../utils/prisma";

export async function getClassesInstructors(
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

  const classesInstructorsProtobuf: InstructorClass[] = classesInstructors.map(
    (item) => {
      const ic = new InstructorClass();
      ic.setClassId(item.classId);
      ic.setInstructorId(item.instructorId);
      return ic;
    },
  );

  const res = new InstructorsClassesResponse().setInstructorsClassesIdsList(
    classesInstructorsProtobuf,
  );
  callback(null, res);
}
