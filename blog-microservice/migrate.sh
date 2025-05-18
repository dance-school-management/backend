#!/bin/bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5438/blog"
npx prisma migrate dev --name init