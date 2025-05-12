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

function serialize_productcommunication_CheckCourseRequest(arg) {
  if (!(arg instanceof productCommunication_pb.CheckCourseRequest)) {
    throw new Error('Expected argument of type productcommunication.CheckCourseRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_productcommunication_CheckCourseRequest(buffer_arg) {
  return productCommunication_pb.CheckCourseRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_productcommunication_CheckResponse(arg) {
  if (!(arg instanceof productCommunication_pb.CheckResponse)) {
    throw new Error('Expected argument of type productcommunication.CheckResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_productcommunication_CheckResponse(buffer_arg) {
  return productCommunication_pb.CheckResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var EnrollWithProductService = exports.EnrollWithProductService = {
  checkClass: {
    path: '/productcommunication.EnrollWithProduct/CheckClass',
    requestStream: false,
    responseStream: false,
    requestType: productCommunication_pb.CheckClassRequest,
    responseType: productCommunication_pb.CheckResponse,
    requestSerialize: serialize_productcommunication_CheckClassRequest,
    requestDeserialize: deserialize_productcommunication_CheckClassRequest,
    responseSerialize: serialize_productcommunication_CheckResponse,
    responseDeserialize: deserialize_productcommunication_CheckResponse,
  },
  checkCourse: {
    path: '/productcommunication.EnrollWithProduct/CheckCourse',
    requestStream: false,
    responseStream: false,
    requestType: productCommunication_pb.CheckCourseRequest,
    responseType: productCommunication_pb.CheckResponse,
    requestSerialize: serialize_productcommunication_CheckCourseRequest,
    requestDeserialize: deserialize_productcommunication_CheckCourseRequest,
    responseSerialize: serialize_productcommunication_CheckResponse,
    responseDeserialize: deserialize_productcommunication_CheckResponse,
  },
};

exports.EnrollWithProductClient = grpc.makeGenericClientConstructor(EnrollWithProductService, 'EnrollWithProduct');
