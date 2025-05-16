// package: productcommunication
// file: AuthCommunication.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as AuthCommunication_pb from "./AuthCommunication_pb";

interface IProfileService
  extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  createProfile: IProfileService_ICreateProfile;
}

interface IProfileService_ICreateProfile
  extends grpc.MethodDefinition<
    AuthCommunication_pb.CreateProfileRequest,
    AuthCommunication_pb.CreateProfileResponse
  > {
  path: "/productcommunication.Profile/CreateProfile";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<AuthCommunication_pb.CreateProfileRequest>;
  requestDeserialize: grpc.deserialize<AuthCommunication_pb.CreateProfileRequest>;
  responseSerialize: grpc.serialize<AuthCommunication_pb.CreateProfileResponse>;
  responseDeserialize: grpc.deserialize<AuthCommunication_pb.CreateProfileResponse>;
}

export const ProfileService: IProfileService;

export interface IProfileServer extends grpc.UntypedServiceImplementation {
  createProfile: grpc.handleUnaryCall<
    AuthCommunication_pb.CreateProfileRequest,
    AuthCommunication_pb.CreateProfileResponse
  >;
}

export interface IProfileClient {
  createProfile(
    request: AuthCommunication_pb.CreateProfileRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: AuthCommunication_pb.CreateProfileResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  createProfile(
    request: AuthCommunication_pb.CreateProfileRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: AuthCommunication_pb.CreateProfileResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  createProfile(
    request: AuthCommunication_pb.CreateProfileRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: AuthCommunication_pb.CreateProfileResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
}

export class ProfileClient extends grpc.Client implements IProfileClient {
  constructor(
    address: string,
    credentials: grpc.ChannelCredentials,
    options?: Partial<grpc.ClientOptions>,
  );
  public createProfile(
    request: AuthCommunication_pb.CreateProfileRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: AuthCommunication_pb.CreateProfileResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public createProfile(
    request: AuthCommunication_pb.CreateProfileRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: AuthCommunication_pb.CreateProfileResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public createProfile(
    request: AuthCommunication_pb.CreateProfileRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: AuthCommunication_pb.CreateProfileResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
}
