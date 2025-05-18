#!/bin/bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5439/review"
npx prisma migrate dev --name init