#!/usr/bin/env bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5435/enroll"

npx prisma migrate reset --skip-seed --force