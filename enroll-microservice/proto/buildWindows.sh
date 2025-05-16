#!/bin/bash

PROTO_DIR=./proto

# Użycie absolutnych ścieżek do pluginów w wersji .cmd lub .exe dla Windows
npx grpc_tools_node_protoc \
  --js_out=import_style=commonjs,binary:${PROTO_DIR} \
  --grpc_out=grpc_js:${PROTO_DIR} \
  --plugin=protoc-gen-grpc="$(pwd)/node_modules/.bin/grpc_tools_node_protoc_plugin.cmd" \
  -I ${PROTO_DIR} \
  ${PROTO_DIR}/*.proto

npx grpc_tools_node_protoc \
  --plugin=protoc-gen-ts="$(pwd)/node_modules/.bin/protoc-gen-ts.cmd" \
  --ts_out=grpc_js:${PROTO_DIR} \
  -I ${PROTO_DIR} \
  ${PROTO_DIR}/*.proto
