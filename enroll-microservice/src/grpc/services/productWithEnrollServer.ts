import { IProductWithEnrollServer } from "../../../proto/productCommunication_grpc_pb";
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import prisma from "../../utils/prisma";
import {
  InstructorClass,
  InstructorIdsRequest,
  InstructorsClassesResponse,
} from "../../../proto/productCommunication_pb";

export const ProductWithEnrollServerImp: IProductWithEnrollServer = {
  async getInstructorsClasses(
    call: ServerUnaryCall<InstructorIdsRequest, InstructorsClassesResponse>,
    callback: sendUnaryData<InstructorsClassesResponse>,
  ): Promise<void> {
    const instructorIds = call.request.getInstructoridsList();
    //need to add checking free slots in Class

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
        ic.setClassid(item.classId);
        ic.setIntructorid(item.instructorId);
        return ic;
      });

    const res = new InstructorsClassesResponse().setInstructorsclassesidsList(
      instructorsClassesProtobuf,
    );
    callback(null, res);
  },
};
