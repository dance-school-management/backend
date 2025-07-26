#!/bin/bash

MICROSERVICES_DIR="./"

for dir in "$MICROSERVICES_DIR"*/ ; do
  if [ -d "$dir" ]; then
    EXAMPLE_FILE="${dir}.env.development.example"
    TARGET_FILE="${dir}.env.development"

    if [ -f "$EXAMPLE_FILE" ]; then
      cp "$EXAMPLE_FILE" "$TARGET_FILE"
      echo "Skopiowano (nadpisano): $EXAMPLE_FILE -> $TARGET_FILE"
    fi
  fi
done
