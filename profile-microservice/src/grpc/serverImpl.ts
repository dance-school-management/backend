import { IAuthToProfileServer } from "../../proto/AuthToProfile_grpc_pb";
import { IProductToProfileServer } from "../../proto/ProductToProfile_grpc_pb";
import { getOtherInstructorsData } from "./services/productCommunication/getOtherInstructorsData";
import { createProfile } from "./services/authCommunication/createProfile";
import { IEnrollToProfileServer } from "../../proto/EnrollToProfile_grpc_pb";
import { getInstructorsData } from "./services/enrollCommunication/getInstructorsData";
import { getInstructorsData as gid } from "./services/productCommunication/getInstructorsData";

export const ProductToProfileServerImpl: IProductToProfileServer = {
  getOtherInstructorsData: getOtherInstructorsData,
  getInstructorsData: gid
}

export const AuthToProfileServerImpl: IAuthToProfileServer = {
  createProfile: createProfile
}

export const EnrollToProfileServerImpl: IEnrollToProfileServer = {
  getInstructorsData: getInstructorsData
}