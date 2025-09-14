import { IAuthToProfileServer } from "../../proto/AuthToProfile_grpc_pb";
import { IProductToProfileServer } from "../../proto/ProductToProfile_grpc_pb";
import { getOtherInstructorsData } from "./services/productCommunication/getOtherInstructorsData";
import { createProfile } from "./services/authCommunication/createProfile";

export const ProductToProfileServerImpl: IProductToProfileServer = {
  getOtherInstructorsData: getOtherInstructorsData
}

export const AuthToProfileServerImpl: IAuthToProfileServer = {
  createProfile: createProfile
}