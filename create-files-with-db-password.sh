#!/usr/bin/env bash

if [ ! -d "db" ]; then
  mkdir db
fi

cd db || exit 1

MICROSERVICES_NAMES=("auth" "enroll" "notification" "product" "profile")

for name in ${MICROSERVICES_NAMES[@]}; do
  FILE_NAME="${name}-db-password.txt"
  if [ ! -f "$FILE_NAME" ]; then
    touch "$FILE_NAME"
    echo postgres > "$FILE_NAME"
    echo Created "$FILE_NAME" with content 'postgres'
  else
    echo File "$FILE_NAME" already exists
  fi
   
done