import { StatusCodes } from "http-status-codes";
import { EmbedRequest, EmbedResponse } from "../../../../proto/Embed_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { embedClient } from "../../../utils/grpcClients";

export async function embed(
  text: string,
  isQuery: boolean,
): Promise<EmbedResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new EmbedRequest().setText(text).setIsQuery(isQuery);
    embedClient.embed(
      request,
      (err: any, response: any) => {
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
