#!/usr/bin/env bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5435/enroll"
export PRODUCT_MICROSERVICE_GRPC="localhost:50051"
export PROFILE_MICROSERVICE_GRPC="localhost:50052"
npx prisma db seed