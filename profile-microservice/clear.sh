#!/bin/bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5436/profiles"

npx prisma migrate reset --skip-seed --force