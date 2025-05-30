import { IDanceCategoriesServer } from "../../../proto/productCommunication_grpc_pb";

import { sendUnaryData, ServerUnaryCall, status } from "@grpc/grpc-js";
import prisma from "../../utils/prisma";
import { UniversalError } from "../../errors/UniversalError";
import { StatusCodes } from "http-status-codes";
import {
  DanceCategory,
  GetDanceCategoriesRequest,
  GetDanceCategoriesResponse,
} from "../../../proto/productCommunication_pb";

export const DanceCategoryServerImp: IDanceCategoriesServer = {
  getDanceCategories: async function (
    call: ServerUnaryCall<
      GetDanceCategoriesRequest,
      GetDanceCategoriesResponse
    >,
    callback: sendUnaryData<GetDanceCategoriesResponse>,
  ): Promise<void> {
    const danceCategoriesIds = call.request.getIdList();
    try {
      const danceCategories = await prisma.danceCategory.findMany({
        where: {
          id: {
            in: danceCategoriesIds,
          },
        },
        select: {
          id: true,
          name: true,
        },
      });
      const res = new GetDanceCategoriesResponse().setDanceCategoriesList(
        danceCategories.map((danceCategory) => {
          const entry = new DanceCategory();
          entry.setId(danceCategory.id);
          entry.setName(danceCategory.name);
          return entry;
        }),
      );
      callback(null, res);
    } catch (error: any) {
      const err = new UniversalError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Problem with accessing dance categories data",
        [],
      );
      callback({ code: status.INTERNAL, details: JSON.stringify(err) });
      return;
    }
  },
};
