#!/usr/bin/env bash
# compare-envs.sh
# Porównuje .env.development z .env.development.example we wszystkich mikroserwisach pod bieżącym katalogiem.
# Uruchamiaj ze ścieżki: backend/

set -u

# Kolorki (jeśli terminal wspiera)
RED="$(printf '\033[31m')"
GREEN="$(printf '\033[32m')"
YELLOW="$(printf '\033[33m')"
CYAN="$(printf '\033[36m')"
BOLD="$(printf '\033[1m')"
RESET="$(printf '\033[0m')"

extract_keys() {
  # wyciąga nazwy kluczy z pliku .env (ignoruje komentarze, puste linie i 'export ')
  # i zwraca posortowaną listę unikalnych kluczy
  local file="$1"
  sed -E '
    s/^\s*export\s+//;        # usuń prefix "export "
    s/\s*#.*$//;              # usuń trailing komentarz
  ' "$file" \
  | grep -E '^[[:space:]]*[A-Za-z_][A-Za-z0-9_]*=' \
  | sed -E 's/^\s*([A-Za-z_][A-Za-z0-9_]*)=.*/\1/' \
  | sed '/^\s*$/d' \
  | sort -u
}

get_value() {
  # pobiera wartość danego klucza z pliku .env (bez otaczających cudzysłowów)
  local file="$1"
  local key="$2"
  local line
  line="$(grep -E "^[[:space:]]*(export[[:space:]]+)?${key}=" -m1 -- "$file" || true)"
  if [[ -z "$line" ]]; then
    printf ""
    return
  fi
  line="${line#*=}"                 # po '='
  line="${line%%[[:space:]]#*}"     # usuń trailing komentarz po spacji (zostawiamy # w wartościach bez spacji)
  # usuń otaczające cudzysłowy jeśli są
  line="$(printf '%s' "$line" | sed -E 's/^"(.*)"$/\1/; s/^'"'"'(.*)'"'"'$/\1/')"
  printf '%s' "$line"
}

compare_pair() {
  local svc="$1"
  local example="$2"
  local dev="$3"

  echo
  echo "${BOLD}${CYAN}▶ ${svc}${RESET}"
  echo "  example:     ${example}"
  echo "  development: ${dev}"

  if [[ ! -f "$example" || ! -f "$dev" ]]; then
    echo "  ${YELLOW}⚠ Pominięto: brak jednej z par (.example / .development).${RESET}"
    return
  fi

  # Klucze
  mapfile -t KEYS_EX < <(extract_keys "$example")
  mapfile -t KEYS_DEV < <(extract_keys "$dev")

  # Tymczasowe pliki dla comm
  tmp_ex=$(mktemp)
  tmp_dev=$(mktemp)
  printf "%s\n" "${KEYS_EX[@]}" > "$tmp_ex"
  printf "%s\n" "${KEYS_DEV[@]}" > "$tmp_dev"

  # 1) Brakujące w .env.development względem example
  missing_in_dev=$(comm -23 "$tmp_ex" "$tmp_dev" || true)
  # 2) Nadmiarowe w .env.development
  extra_in_dev=$(comm -13 "$tmp_ex" "$tmp_dev" || true)
  # 3) Wspólne klucze
  common_keys=$(comm -12 "$tmp_ex" "$tmp_dev" || true)

  rm -f "$tmp_ex" "$tmp_dev"

  if [[ -n "$missing_in_dev" ]]; then
    echo "  ${RED}✖ Brakujące w .env.development (są w .example):${RESET}"
    printf '    - %s\n' $missing_in_dev
  else
    echo "  ${GREEN}✔ Brakujących kluczy: 0${RESET}"
  fi

  if [[ -n "$extra_in_dev" ]]; then
    echo "  ${YELLOW}• Nadmiarowe w .env.development (nie ma w .example):${RESET}"
    printf '    - %s\n' $extra_in_dev
  else
    echo "  ${GREEN}✔ Nadmiarowych kluczy: 0${RESET}"
  fi

  # Porównanie wartości wspólnych kluczy
  diff_count=0
  while IFS= read -r key; do
    [[ -z "$key" ]] && continue
    val_ex="$(get_value "$example" "$key")"
    val_dev="$(get_value "$dev" "$key")"
    if [[ "$val_ex" != "$val_dev" ]]; then
      if (( diff_count == 0 )); then
        echo "  ${YELLOW}• Różniące się wartości:${RESET}"
      fi
      diff_count=$((diff_count + 1))
      echo "    - ${BOLD}$key${RESET}"
      echo "        example:     '${val_ex}'"
      echo "        development: '${val_dev}'"
    fi
  done <<< "$common_keys"

  if (( diff_count == 0 )); then
    echo "  ${GREEN}✔ Wartości wspólnych kluczy są zgodne${RESET}"
  fi
}

main() {
  local base="${1:-.}"
  local found_any=0

  # Szukamy mikroserwisów w podkatalogach (np. *-microservice) – ale kryterium to obecność plików .env.*
  for dir in "$base"/*/ ; do
    [[ -d "$dir" ]] || continue
    ex_file="${dir}.env.development.example"
    dev_file="${dir}.env.development"
    if [[ -f "$ex_file" || -f "$dev_file" ]]; then
      found_any=1
      compare_pair "$(basename "$dir")" "$ex_file" "$dev_file"
    fi
  done

  if [[ $found_any -eq 0 ]]; then
    echo "${YELLOW}Nie znaleziono żadnych par plików .env.development(.example) w podkatalogach.${RESET}"
    exit 1
  fi
}

main "$@"
