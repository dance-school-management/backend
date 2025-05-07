#!/bin/bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5434/auth"
npx prisma migrate dev --name init