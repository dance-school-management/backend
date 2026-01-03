#!/usr/bin/env bash
cd ..
# Output directory relative to backend directory
OUTPUT_BASE="../../../Praca-inzynierska-zespol-10/pdf"

# Iterate through all directories (microservices)
for service in */; do
    # Skip if not a directory
    [ -d "$service" ] || continue

    # Extract microservice name (before the first hyphen)
    microservice_name="${service%%-*}"

    # Check if the microservice contains a prisma directory
    if [ -d "${service}prisma" ]; then
        echo "Processing service: $service"

        # Move into the prisma directory
        cd "${service}prisma" || exit 1

        # Create the output directory (safe even if it already exists)
        mkdir -p erd

        # Generate Prisma files including the ERD markdown
        npx prisma generate

        # Path to the generated ERD file
        INPUT_FILE="erd/erd.md"
        OUTPUT_FILE="erd/erd.mmd"

        # Remove code fences from the beginning ("```mermaid") and end ("```")
        sed '1s/^```mermaid$//' "$INPUT_FILE" | sed '$s/^```$//' > "$OUTPUT_FILE"

        # Ensure output directory exists
        mkdir -p "$OUTPUT_BASE"

        # Final PDF path
        FINAL_PDF="${OUTPUT_BASE}/${microservice_name}-ERD.pdf"

        # Generate the final PDF using Mermaid CLI
        mmdc -f -i "$OUTPUT_FILE" -o "$FINAL_PDF"

        echo "Saved PDF: $FINAL_PDF"

        # Return to the backend directory
        cd - >/dev/null
    fi
done
