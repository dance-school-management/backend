// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var productCommunication_pb = require('./productCommunication_pb.js');

function serialize_productcommunication_CheckClassRequest(arg) {
  if (!(arg instanceof productCommunication_pb.CheckClassRequest)) {
    throw new Error('Expected argument of type productcommunication.CheckClassRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_productcommunication_CheckClassRequest(buffer_arg) {
  return productCommunication_pb.CheckClassRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_productcommunication_CheckClassResponse(arg) {
  if (!(arg instanceof productCommunication_pb.CheckClassResponse)) {
    throw new Error('Expected argument of type productcommunication.CheckClassResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_productcommunication_CheckClassResponse(buffer_arg) {
  return productCommunication_pb.CheckClassResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var EnrollWithProductService = exports.EnrollWithProductService = {
  checkClass: {
    path: '/productcommunication.EnrollWithProduct/CheckClass',
    requestStream: false,
    responseStream: false,
    requestType: productCommunication_pb.CheckClassRequest,
    responseType: productCommunication_pb.CheckClassResponse,
    requestSerialize: serialize_productcommunication_CheckClassRequest,
    requestDeserialize: deserialize_productcommunication_CheckClassRequest,
    responseSerialize: serialize_productcommunication_CheckClassResponse,
    responseDeserialize: deserialize_productcommunication_CheckClassResponse,
  },
};

exports.EnrollWithProductClient = grpc.makeGenericClientConstructor(EnrollWithProductService, 'EnrollWithProduct');
