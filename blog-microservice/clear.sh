#!/usr/bin/env bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5439/blog"

npx prisma migrate reset --skip-seed --force

