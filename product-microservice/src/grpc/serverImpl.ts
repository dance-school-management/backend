import { IElasticsearchToProductServer } from "../../proto/ElasticsearchToProduct_grpc_pb";
import { IEnrollToProductServer } from "../../proto/EnrollToProduct_grpc_pb";
import { IProfileToProductServer } from "../../proto/ProfileToProduct_grpc_pb";
import { getClassTemplatesData } from "./services/elasticsearchCommunication/getClassTemplatesData";
import { getCoursesData } from "./services/elasticsearchCommunication/getCoursesData";
import { checkClass } from "./services/enrollCommunication/checkClass";
import { checkCourse } from "./services/enrollCommunication/checkCourse";
import { getClassesDetails } from "./services/enrollCommunication/getClassesDetails";
import { getCoursesDetails } from "./services/enrollCommunication/getCoursesDetails";
import { getDanceCategories } from "./services/profileCommunication/getDanceCategories";

export const ProfileToProductServerImpl: IProfileToProductServer = {
  getDanceCategories: getDanceCategories,
};

export const EnrollToProductServerImpl: IEnrollToProductServer = {
  checkClass: checkClass,
  checkCourse: checkCourse,
  getClassesDetails: getClassesDetails,
  getCoursesDetails: getCoursesDetails
};

export const ElasticsearchToProductServerImpl: IElasticsearchToProductServer = {
  getCoursesData: getCoursesData,
  getClassTemplatesData: getClassTemplatesData
}
