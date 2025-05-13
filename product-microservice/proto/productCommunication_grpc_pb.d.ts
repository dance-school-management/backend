// package: productcommunication
// file: productCommunication.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as productCommunication_pb from "./productCommunication_pb";

interface IEnrollWithProductService
  extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  checkClass: IEnrollWithProductService_ICheckClass;
  checkCourse: IEnrollWithProductService_ICheckCourse;
}

interface IEnrollWithProductService_ICheckClass
  extends grpc.MethodDefinition<
    productCommunication_pb.CheckClassRequest,
    productCommunication_pb.CheckResponse
  > {
  path: "/productcommunication.EnrollWithProduct/CheckClass";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<productCommunication_pb.CheckClassRequest>;
  requestDeserialize: grpc.deserialize<productCommunication_pb.CheckClassRequest>;
  responseSerialize: grpc.serialize<productCommunication_pb.CheckResponse>;
  responseDeserialize: grpc.deserialize<productCommunication_pb.CheckResponse>;
}
interface IEnrollWithProductService_ICheckCourse
  extends grpc.MethodDefinition<
    productCommunication_pb.CheckCourseRequest,
    productCommunication_pb.CheckResponse
  > {
  path: "/productcommunication.EnrollWithProduct/CheckCourse";
  requestStream: false;
  responseStream: false;
  requestSerialize: grpc.serialize<productCommunication_pb.CheckCourseRequest>;
  requestDeserialize: grpc.deserialize<productCommunication_pb.CheckCourseRequest>;
  responseSerialize: grpc.serialize<productCommunication_pb.CheckResponse>;
  responseDeserialize: grpc.deserialize<productCommunication_pb.CheckResponse>;
}

export const EnrollWithProductService: IEnrollWithProductService;

export interface IEnrollWithProductServer
  extends grpc.UntypedServiceImplementation {
  checkClass: grpc.handleUnaryCall<
    productCommunication_pb.CheckClassRequest,
    productCommunication_pb.CheckResponse
  >;
  checkCourse: grpc.handleUnaryCall<
    productCommunication_pb.CheckCourseRequest,
    productCommunication_pb.CheckResponse
  >;
}

export interface IEnrollWithProductClient {
  checkClass(
    request: productCommunication_pb.CheckClassRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: productCommunication_pb.CheckResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  checkClass(
    request: productCommunication_pb.CheckClassRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: productCommunication_pb.CheckResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  checkClass(
    request: productCommunication_pb.CheckClassRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: productCommunication_pb.CheckResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  checkCourse(
    request: productCommunication_pb.CheckCourseRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: productCommunication_pb.CheckResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  checkCourse(
    request: productCommunication_pb.CheckCourseRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: productCommunication_pb.CheckResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  checkCourse(
    request: productCommunication_pb.CheckCourseRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: productCommunication_pb.CheckResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
}

export class EnrollWithProductClient
  extends grpc.Client
  implements IEnrollWithProductClient
{
  constructor(
    address: string,
    credentials: grpc.ChannelCredentials,
    options?: Partial<grpc.ClientOptions>,
  );
  public checkClass(
    request: productCommunication_pb.CheckClassRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: productCommunication_pb.CheckResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public checkClass(
    request: productCommunication_pb.CheckClassRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: productCommunication_pb.CheckResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public checkClass(
    request: productCommunication_pb.CheckClassRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: productCommunication_pb.CheckResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public checkCourse(
    request: productCommunication_pb.CheckCourseRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: productCommunication_pb.CheckResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public checkCourse(
    request: productCommunication_pb.CheckCourseRequest,
    metadata: grpc.Metadata,
    callback: (
      error: grpc.ServiceError | null,
      response: productCommunication_pb.CheckResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
  public checkCourse(
    request: productCommunication_pb.CheckCourseRequest,
    metadata: grpc.Metadata,
    options: Partial<grpc.CallOptions>,
    callback: (
      error: grpc.ServiceError | null,
      response: productCommunication_pb.CheckResponse,
    ) => void,
  ): grpc.ClientUnaryCall;
}
