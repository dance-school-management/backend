#!/bin/bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5435/notification"
npx prisma migrate dev --name init