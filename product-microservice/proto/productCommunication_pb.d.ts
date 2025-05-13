// package: productcommunication
// file: productCommunication.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class CheckClassRequest extends jspb.Message {
  getClassId(): number;
  setClassId(value: number): CheckClassRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckClassRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: CheckClassRequest,
  ): CheckClassRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: CheckClassRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): CheckClassRequest;
  static deserializeBinaryFromReader(
    message: CheckClassRequest,
    reader: jspb.BinaryReader,
  ): CheckClassRequest;
}

export namespace CheckClassRequest {
  export type AsObject = {
    classId: number;
  };
}

export class CheckCourseRequest extends jspb.Message {
  getCourseId(): number;
  setCourseId(value: number): CheckCourseRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckCourseRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: CheckCourseRequest,
  ): CheckCourseRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: CheckCourseRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): CheckCourseRequest;
  static deserializeBinaryFromReader(
    message: CheckCourseRequest,
    reader: jspb.BinaryReader,
  ): CheckCourseRequest;
}

export namespace CheckCourseRequest {
  export type AsObject = {
    courseId: number;
  };
}

export class CheckResponse extends jspb.Message {
  getIsValid(): boolean;
  setIsValid(value: boolean): CheckResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: CheckResponse,
  ): CheckResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: CheckResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): CheckResponse;
  static deserializeBinaryFromReader(
    message: CheckResponse,
    reader: jspb.BinaryReader,
  ): CheckResponse;
}

export namespace CheckResponse {
  export type AsObject = {
    isValid: boolean;
  };
}
