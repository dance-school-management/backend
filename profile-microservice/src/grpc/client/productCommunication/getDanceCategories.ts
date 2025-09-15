import {
  DanceCategoriesIdsRequest,
  GetDanceCategoriesResponse,
} from "../../../../proto/ProfileToProductMessages_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { danceCategoriesClient } from "../../../utils/grpcClients";

export async function getDanceCategories(
  danceCategoriesIds: number[],
): Promise<GetDanceCategoriesResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new DanceCategoriesIdsRequest().setIdList(
      danceCategoriesIds,
    );
    danceCategoriesClient.getDanceCategories(
      request,
      (err, response) => {
        console.log(err);
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
            unErr = new UniversalError(500, "Internal Server Error", []);
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
