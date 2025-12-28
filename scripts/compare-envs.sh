#!/usr/bin/env bash
# compare-envs.sh
# Compares .env.development and .env.development.local with their respective .example files
# across all microservices under the current directory.
# Run from path: backend/
cd ..
set -u

# Colors (if terminal supports)
RED="$(printf '\033[31m')"
GREEN="$(printf '\033[32m')"
YELLOW="$(printf '\033[33m')"
CYAN="$(printf '\033[36m')"
BOLD="$(printf '\033[1m')"
RESET="$(printf '\033[0m')"

extract_keys() {
  # extracts variable names from a .env file (ignores comments, empty lines and 'export ')
  # returns a sorted list of unique keys
  local file="$1"
  sed -E '
    s/^\s*export\s+//;        # remove "export " prefix
    s/\s*#.*$//;              # remove trailing comment
  ' "$file" \
  | grep -E '^[[:space:]]*[A-Za-z_][A-Za-z0-9_]*=' \
  | sed -E 's/^\s*([A-Za-z_][A-Za-z0-9_]*)=.*/\1/' \
  | sed '/^\s*$/d' \
  | sort -u
}

get_value() {
  # gets the value of a given key from a .env file (without surrounding quotes)
  local file="$1"
  local key="$2"
  local line
  line="$(grep -E "^[[:space:]]*(export[[:space:]]+)?${key}=" -m1 -- "$file" || true)"
  if [[ -z "$line" ]]; then
    printf ""
    return
  fi
  line="${line#*=}"                 # strip everything before '='
  line="${line%%[[:space:]]#*}"     # remove trailing comment (after space); keep '#' if inside value
  # remove surrounding quotes if present
  line="$(printf '%s' "$line" | sed -E 's/^"(.*)"$/\1/; s/^'"'"'(.*)'"'"'$/\1/')"
  printf '%s' "$line"
}

compare_pair() {
  local svc="$1"
  local example="$2"
  local dev="$3"
  local label="$4"

  echo
  echo "${BOLD}${CYAN}▶ ${svc}${RESET} (${label})"
  echo "  example:     ${example}"
  echo "  development: ${dev}"

  if [[ ! -f "$example" || ! -f "$dev" ]]; then
    echo "  ${YELLOW}⚠ Skipped: missing one of the files (.example / .development).${RESET}"
    return
  fi

  # Keys
  mapfile -t KEYS_EX < <(extract_keys "$example")
  mapfile -t KEYS_DEV < <(extract_keys "$dev")

  # Temporary files for comm
  tmp_ex=$(mktemp)
  tmp_dev=$(mktemp)
  printf "%s\n" "${KEYS_EX[@]}" > "$tmp_ex"
  printf "%s\n" "${KEYS_DEV[@]}" > "$tmp_dev"

  # 1) Keys missing in .env.development compared to example
  missing_in_dev=$(comm -23 "$tmp_ex" "$tmp_dev" || true)
  # 2) Extra keys in .env.development
  extra_in_dev=$(comm -13 "$tmp_ex" "$tmp_dev" || true)
  # 3) Common keys
  common_keys=$(comm -12 "$tmp_ex" "$tmp_dev" || true)

  rm -f "$tmp_ex" "$tmp_dev"

  if [[ -n "$missing_in_dev" ]]; then
    echo "  ${RED}✖ Missing in ${dev} (present in example):${RESET}"
    printf '    - %s\n' $missing_in_dev
  else
    echo "  ${GREEN}✔ Missing keys: 0${RESET}"
  fi

  if [[ -n "$extra_in_dev" ]]; then
    echo "  ${YELLOW}• Extra keys in ${dev} (not in example):${RESET}"
    printf '    - %s\n' $extra_in_dev
  else
    echo "  ${GREEN}✔ Extra keys: 0${RESET}"
  fi

  # Compare values of common keys
  diff_count=0
  while IFS= read -r key; do
    [[ -z "$key" ]] && continue
    val_ex="$(get_value "$example" "$key")"
    val_dev="$(get_value "$dev" "$key")"
    if [[ "$val_ex" != "$val_dev" ]]; then
      if (( diff_count == 0 )); then
        echo "  ${YELLOW}• Different values:${RESET}"
      fi
      diff_count=$((diff_count + 1))
      echo "    - ${BOLD}$key${RESET}"
      echo "        example:     '${val_ex}'"
      echo "        development: '${val_dev}'"
    fi
  done <<< "$common_keys"

  if (( diff_count == 0 )); then
    echo "  ${GREEN}✔ All common key values match${RESET}"
  fi
}

main() {
  local base="${1:-.}"
  local found_any=0

  # Look for microservices in subdirectories (e.g. *-microservice)
  # – criterion is presence of .env.* files
  for dir in "$base"/*/ ; do
    [[ -d "$dir" ]] || continue

    ex_file="${dir}.env.development.example"
    dev_file="${dir}.env.development"
    ex_file_local="${dir}.env.development.local.example"
    dev_file_local="${dir}.env.development.local"

    if [[ -f "$ex_file" || -f "$dev_file" ]]; then
      found_any=1
      compare_pair "$(basename "$dir")" "$ex_file" "$dev_file" ".env.development"
    fi

    if [[ -f "$ex_file_local" || -f "$dev_file_local" ]]; then
      found_any=1
      compare_pair "$(basename "$dir")" "$ex_file_local" "$dev_file_local" ".env.development.local"
    fi
  done

  if [[ $found_any -eq 0 ]]; then
    echo "${YELLOW}No .env.development(.example) or .env.development.local(.example) pairs found in subdirectories.${RESET}"
    exit 1
  fi
}

main "$@"
