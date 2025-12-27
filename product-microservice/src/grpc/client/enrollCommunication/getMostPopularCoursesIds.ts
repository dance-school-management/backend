import { StatusCodes } from "http-status-codes";
import { GetMostPopularCoursesIdsRequest, GetMostPopularCoursesIdsResponse } from "../../../../proto/ProductToEnrollMessages_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { productWithEnrollClient } from "../../../utils/grpcClients";

export async function getMostPopularCoursesIds(
  consideredCoursesIds: number[],
  topK: number,
): Promise<GetMostPopularCoursesIdsResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new GetMostPopularCoursesIdsRequest()
      .setConsideredCoursesIdsList(consideredCoursesIds)
      .setTopk(topK);
    productWithEnrollClient.getMostPopularCoursesIds(
      request,
      (err, response) => {
        if (err) {
          let unErr: UniversalError;
          try {
            const error = JSON.parse(err.details);
            unErr = new UniversalError(
              error.statusCode,
              error.message,
              error.errors,
            );
          } catch (parseError) {
            console.error("Failed to parse gRPC error details:", parseError);
            unErr = new UniversalError(
              StatusCodes.INTERNAL_SERVER_ERROR,
              "Internal Server Error",
              [],
            );
          }
          reject(unErr);
          return;
        }
        resolve(response.toObject());
        return;
      },
    );
  });
}
