#!/bin/bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5435/enroll"
npx prisma db seed