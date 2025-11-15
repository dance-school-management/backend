import { IAuthToProfileServer } from "../../proto/AuthToProfile_grpc_pb";
import { IProductToProfileServer } from "../../proto/ProductToProfile_grpc_pb";
import { getOtherInstructorsData } from "./services/productCommunication/getOtherInstructorsData";
import { createProfile } from "./services/authCommunication/createProfile";
import { IEnrollToProfileServer } from "../../proto/EnrollToProfile_grpc_pb";
import { getInstructorsData } from "./services/enrollCommunication/getInstructorsData";
import { getInstructorsData as gid } from "./services/productCommunication/getInstructorsData";
import { getStudentsProfiles } from "./services/productCommunication/getStudentsProfiles";

export const ProductToProfileServerImpl: IProductToProfileServer = {
  getOtherInstructorsData: getOtherInstructorsData,
  getInstructorsData: gid,
  getStudentsProfiles: getStudentsProfiles
}

export const AuthToProfileServerImpl: IAuthToProfileServer = {
  createProfile: createProfile
}

export const EnrollToProfileServerImpl: IEnrollToProfileServer = {
  getInstructorsData: getInstructorsData
}