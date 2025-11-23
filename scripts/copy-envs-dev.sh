#!/usr/bin/env bash
cd ..
MICROSERVICES_DIR="./"

for dir in "$MICROSERVICES_DIR"*/ ; do
  if [ -d "$dir" ]; then
    EXAMPLE_FILE="${dir}.env.development.example"
    TARGET_FILE="${dir}.env.development"

    EXAMPLE_LOCAL_FILE="${dir}.env.development.local.example"
    TARGET_LOCAL_FILE="${dir}.env.development.local"

    if [ -f "$EXAMPLE_FILE" ]; then
      cp "$EXAMPLE_FILE" "$TARGET_FILE"
      echo "Copied (overwritten): $EXAMPLE_FILE -> $TARGET_FILE"
    fi

    if [ -f "$EXAMPLE_LOCAL_FILE" ]; then
      cp "$EXAMPLE_LOCAL_FILE" "$TARGET_LOCAL_FILE"
      echo "Copied (overwritten): $EXAMPLE_LOCAL_FILE -> $TARGET_LOCAL_FILE"
    fi
  fi
done
