#!/usr/bin/env bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5437/notification"

npx prisma migrate reset --skip-seed --force