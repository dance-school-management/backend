import { StatusCodes } from "http-status-codes";
import { Course, Prisma } from "../../../../generated/client";
import {
  AddClassTemplateRequest,
  AddClassTemplateResponse,
  AddCourseRequest,
  AddCourseResponse,
  AdvancementLevel,
  DanceCategory,
} from "../../../../proto/ProductToElasticsearch_pb";
import { UniversalError } from "../../../errors/UniversalError";
import { productWithElasticsearchClient } from "../../../utils/grpcClients";

type ClassTemplateWithDCAndAL = Prisma.ClassTemplateGetPayload<{
  include: { danceCategory: true; advancementLevel: true };
}>;

export async function addClassTemplate(
  course: ClassTemplateWithDCAndAL,
): Promise<AddClassTemplateResponse.AsObject> {
  return new Promise((resolve, reject) => {
    const request = new AddClassTemplateRequest()
      .setClassTemplateId(course.id)
      .setClassTemplateName(course.name)
      .setClassTemplateDescription(course.description)
      // Requires a helper method from other branch
      .setPrice(200);
    if (course.danceCategory)
      request.setDanceCategory(
        new DanceCategory()
          .setId(course.danceCategory.id)
          .setName(course.danceCategory.name)
          .setDescription(course.danceCategory.description),
      );
    if (course.advancementLevel)
      request.setAdvancementLevel(
        new AdvancementLevel()
          .setId(course.advancementLevel.id)
          .setName(course.advancementLevel.name)
          .setDescription(course.advancementLevel.description),
      );
    productWithElasticsearchClient.addClassTemplate(
      request,
      (err: any, response: any) => {
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
