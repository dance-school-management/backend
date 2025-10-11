import { getInstructorsClasses } from "./services/productCommunication/getInstructorsClasses";
import { getClassesInstructors } from "./services/productCommunication/getClassesInstructors";
import { enrollInstructorsInClass } from "./services/productCommunication/enrollInstructorsInClass";
import { getClassesStudents } from "./services/productCommunication/getClassesStudents";
import { getStudentClasses } from "./services/productCommunication/getStudentClasses";
import { IProductToEnrollServer } from "../../proto/ProductToEnroll_grpc_pb";
import { getMostPopularCoursesIds } from "./services/productCommunication/getMostPopularCoursesIds";

export const ProductToEnrollServerImp: IProductToEnrollServer = {
  getInstructorsClasses: getInstructorsClasses,
  getClassesInstructors: getClassesInstructors,
  enrollInstructorsInClass: enrollInstructorsInClass,
  getClassesStudents: getClassesStudents,
  getStudentClasses: getStudentClasses,
  getMostPopularCoursesIds: getMostPopularCoursesIds
};
