#!/bin/bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5433/products"
npx prisma migrate dev --name init