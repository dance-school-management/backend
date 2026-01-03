#!/usr/bin/env bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5434/products"
export ENROLL_MICROSERVICE_GRPC_URL="localhost:50053"
export PROFILE_MICROSERVICE_GRPC_URL="localhost:50052"

echo "Running prisma db seed..."
npx prisma db seed