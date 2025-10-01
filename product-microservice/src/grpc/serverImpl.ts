import { IEnrollToProductServer } from "../../proto/EnrollToProduct_grpc_pb";
import { IProfileToProductServer } from "../../proto/ProfileToProduct_grpc_pb";
import { checkClass } from "./services/enrollCommunication/checkClass";
import { checkCourse } from "./services/enrollCommunication/checkCourse";
import { getClassesDetails } from "./services/enrollCommunication/getClassesDetails";
import { getCoursesClasses } from "./services/enrollCommunication/getCoursesClasses";
import { getCoursesDetails } from "./services/enrollCommunication/getCoursesDetails";
import { getDanceCategoriesOfCourses } from "./services/enrollCommunication/getDanceCategoriesOfCourses";
import { getSpentHoursDanceCategories, getSpentHoursInstructors } from "./services/enrollCommunication/getSpentHours";
import { getDanceCategories } from "./services/profileCommunication/getDanceCategories";

export const ProfileToProductServerImpl: IProfileToProductServer = {
  getDanceCategories: getDanceCategories,
};

export const EnrollToProductServerImpl: IEnrollToProductServer = {
  checkClass: checkClass,
  checkCourse: checkCourse,
  getClassesDetails: getClassesDetails,
  getCoursesDetails: getCoursesDetails,
  getCoursesClasses: getCoursesClasses,
  getDanceCategoriesOfCourses: getDanceCategoriesOfCourses,
  getSpentHoursDanceCategories: getSpentHoursDanceCategories,
  getSpentHoursInstructors: getSpentHoursInstructors
};
