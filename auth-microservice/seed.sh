#!/bin/bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5433/auth"
export PROFILE_MICROSERVICE_GRPC_URL="localhost:50052" 
npx prisma db seed