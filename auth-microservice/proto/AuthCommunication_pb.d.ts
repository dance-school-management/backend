// package: productcommunication
// file: AuthCommunication.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class CreateProfileRequest extends jspb.Message {
  getId(): string;
  setId(value: string): CreateProfileRequest;
  getName(): string;
  setName(value: string): CreateProfileRequest;
  getSurname(): string;
  setSurname(value: string): CreateProfileRequest;
  getRole(): Role;
  setRole(value: Role): CreateProfileRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateProfileRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: CreateProfileRequest,
  ): CreateProfileRequest.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: CreateProfileRequest,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): CreateProfileRequest;
  static deserializeBinaryFromReader(
    message: CreateProfileRequest,
    reader: jspb.BinaryReader,
  ): CreateProfileRequest;
}

export namespace CreateProfileRequest {
  export type AsObject = {
    id: string;
    name: string;
    surname: string;
    role: Role;
  };
}

export class CreateProfileResponse extends jspb.Message {
  getIsValid(): boolean;
  setIsValid(value: boolean): CreateProfileResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateProfileResponse.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: CreateProfileResponse,
  ): CreateProfileResponse.AsObject;
  static extensions: { [key: number]: jspb.ExtensionFieldInfo<jspb.Message> };
  static extensionsBinary: {
    [key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>;
  };
  static serializeBinaryToWriter(
    message: CreateProfileResponse,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): CreateProfileResponse;
  static deserializeBinaryFromReader(
    message: CreateProfileResponse,
    reader: jspb.BinaryReader,
  ): CreateProfileResponse;
}

export namespace CreateProfileResponse {
  export type AsObject = {
    isValid: boolean;
  };
}

export enum Role {
  INSTRUCTOR = 0,
  COORDINATOR = 1,
  STUDENT = 2,
}
