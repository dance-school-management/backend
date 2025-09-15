#!/usr/bin/env bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5434/products"
npx prisma db seed