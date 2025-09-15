#!/usr/bin/env bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5437/notification"
npx prisma migrate dev --name init