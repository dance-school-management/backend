import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { ClassTemplateData, ClassTemplatesIdsRequest, GetClassTemplatesDataResponse } from "../../../../proto/ElasticsearchToProduct_pb";
import prisma from "../../../utils/prisma";

export async function getClassTemplatesData(
  call: ServerUnaryCall<ClassTemplatesIdsRequest, GetClassTemplatesDataResponse>,
  callback: sendUnaryData<GetClassTemplatesDataResponse>,
): Promise<void> {
  const classTemplatesIds = call.request.getClassesTemplatesIdsList();

  const classTemplatesData = await prisma.classTemplate.findMany({
    where: {
      id: {
        in: classTemplatesIds,
      },
    },
    include: {
      danceCategory: true,
      advancementLevel: true,
    },
  });

  const response = new GetClassTemplatesDataResponse();
  const classTemplatesDataList = classTemplatesData.map((ctd) => {
    const classTemplateData =  new ClassTemplateData()
      .setClassTemplateId(ctd.id)
      .setClassTemplateName(ctd.name)
    if (ctd.danceCategory) classTemplateData.setDanceCategoryName(ctd.danceCategory.name)
    if (ctd.advancementLevel) classTemplateData.setAdvancementLevelName(ctd.advancementLevel.name)
    return classTemplateData
  });
  response.setClassesTemplatesDataList(classTemplatesDataList);
  callback(null, response)
}
