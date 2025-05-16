// GENERATED CODE -- DO NOT EDIT!

"use strict";
var grpc = require("@grpc/grpc-js");
var AuthCommunication_pb = require("./AuthCommunication_pb.js");

function serialize_productcommunication_CreateProfileRequest(arg) {
  if (!(arg instanceof AuthCommunication_pb.CreateProfileRequest)) {
    throw new Error(
      "Expected argument of type productcommunication.CreateProfileRequest",
    );
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_productcommunication_CreateProfileRequest(buffer_arg) {
  return AuthCommunication_pb.CreateProfileRequest.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

function serialize_productcommunication_CreateProfileResponse(arg) {
  if (!(arg instanceof AuthCommunication_pb.CreateProfileResponse)) {
    throw new Error(
      "Expected argument of type productcommunication.CreateProfileResponse",
    );
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_productcommunication_CreateProfileResponse(buffer_arg) {
  return AuthCommunication_pb.CreateProfileResponse.deserializeBinary(
    new Uint8Array(buffer_arg),
  );
}

var ProfileService = (exports.ProfileService = {
  createProfile: {
    path: "/productcommunication.Profile/CreateProfile",
    requestStream: false,
    responseStream: false,
    requestType: AuthCommunication_pb.CreateProfileRequest,
    responseType: AuthCommunication_pb.CreateProfileResponse,
    requestSerialize: serialize_productcommunication_CreateProfileRequest,
    requestDeserialize: deserialize_productcommunication_CreateProfileRequest,
    responseSerialize: serialize_productcommunication_CreateProfileResponse,
    responseDeserialize: deserialize_productcommunication_CreateProfileResponse,
  },
});

exports.ProfileClient = grpc.makeGenericClientConstructor(
  ProfileService,
  "Profile",
);
