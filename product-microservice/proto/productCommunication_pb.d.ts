// package: productcommunication
// file: productCommunication.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class CheckClassRequest extends jspb.Message { 
    getClassid(): number;
    setClassid(value: number): CheckClassRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CheckClassRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CheckClassRequest): CheckClassRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CheckClassRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CheckClassRequest;
    static deserializeBinaryFromReader(message: CheckClassRequest, reader: jspb.BinaryReader): CheckClassRequest;
}

export namespace CheckClassRequest {
    export type AsObject = {
        classid: number,
    }
}

export class CheckClassResponse extends jspb.Message { 
    getIsthere(): boolean;
    setIsthere(value: boolean): CheckClassResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CheckClassResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CheckClassResponse): CheckClassResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CheckClassResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CheckClassResponse;
    static deserializeBinaryFromReader(message: CheckClassResponse, reader: jspb.BinaryReader): CheckClassResponse;
}

export namespace CheckClassResponse {
    export type AsObject = {
        isthere: boolean,
    }
}
