import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import {
  InstructorClass,
  InstructorIdsRequest,
  InstructorsClassesResponse,
} from "../../../../proto/ProductToEnrollMessages_pb";
import prisma from "../../../utils/prisma";

export async function getInstructorsClasses(
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
  const instructorsClassesProtobuf: InstructorClass[] = instructorsClasses.map(
    (item) => {
      const ic = new InstructorClass();
      ic.setClassId(item.classId);
      ic.setInstructorId(item.instructorId);
      return ic;
    },
  );

  const res = new InstructorsClassesResponse().setInstructorsClassesIdsList(
    instructorsClassesProtobuf,
  );
  callback(null, res);
}
