#!/usr/bin/env bash
set -euo pipefail

# Supabase On-Demand CLI Wrapper
# References: change-flow-adapter.md
# Project Ref: rhkrhkxrnpfnrqxwjojo

PROJECT_REF="rhkrhkxrnpfnrqxwjojo"

if ! command -v pass >/dev/null 2>&1; then
  echo "Error: pass utility is required for credentials." >&2
  exit 1
fi

SUPABASE_ACCESS_TOKEN="$(pass show supabase.com/token-min2spapa)"
export SUPABASE_ACCESS_TOKEN

case "${1:-}" in
  gen-types)
    mkdir -p src/types
    echo "Generating TypeScript types for Supabase project ${PROJECT_REF}..."
    npx -y supabase@2.118.0 gen types typescript --project-id "${PROJECT_REF}" > src/types/database.types.ts
    echo "Successfully generated src/types/database.types.ts"
    exit 0
    ;;
  link)
    DB_PASSWORD="$(pass show supabase.com/passward-db)"
    echo "Linking local repository to Supabase project ${PROJECT_REF}..."
    npx -y supabase@2.118.0 link --project-ref "${PROJECT_REF}" --password "${DB_PASSWORD}"
    echo "Successfully linked to ${PROJECT_REF}"
    exit 0
    ;;
  migrate|db-push)
    DB_PASSWORD="$(pass show supabase.com/passward-db)"
    echo "Applying migrations to remote Supabase project ${PROJECT_REF}..."
    # Ensure project is linked first
    npx -y supabase@2.118.0 link --project-ref "${PROJECT_REF}" --password "${DB_PASSWORD}" || true
    npx -y supabase@2.118.0 db push --linked --password "${DB_PASSWORD}" --include-all
    echo "Successfully applied migrations."
    exit 0
    ;;
  seed)
    DB_PASSWORD="$(pass show supabase.com/passward-db)"
    echo "Applying seed data to remote Supabase project ${PROJECT_REF}..."
    npx -y supabase@2.118.0 link --project-ref "${PROJECT_REF}" --password "${DB_PASSWORD}" || true
    npx -y supabase@2.118.0 db query --linked -f supabase/seed.sql
    echo "Successfully applied seed data."
    exit 0
    ;;
  network-allow-ip)
    IP="${2:-}"
    if [ -z "${IP}" ]; then
      echo "Detecting public IP address..."
      IP="$(curl -s --connect-timeout 5 https://api.ipify.org || curl -s --connect-timeout 5 https://ifconfig.me || true)"
    fi
    if [ -z "${IP}" ]; then
      echo "Error: Failed to detect public IP address." >&2
      exit 1
    fi
    if [[ "${IP}" != *"/"* ]]; then
      CIDR="${IP}/32"
    else
      CIDR="${IP}"
    fi
    echo "Configuring Supabase DB network restrictions for: ${CIDR}..."
    RESPONSE="$(curl -s -w "\n%{http_code}" -X POST "https://api.supabase.com/v1/projects/${PROJECT_REF}/network-restrictions/apply" \
      -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{\"dbAllowedCidrs\":[\"${CIDR}\"],\"dbAllowedCidrsV6\":[]}")"
    HTTP_CODE="$(echo "${RESPONSE}" | tail -n1)"
    BODY="$(echo "${RESPONSE}" | head -n -1)"
    if [ "${HTTP_CODE}" -ge 200 ] && [ "${HTTP_CODE}" -lt 300 ]; then
      echo "Successfully updated network restrictions: ${CIDR}"
      echo "${BODY}"
      exit 0
    else
      echo "Error updating network restrictions (HTTP ${HTTP_CODE}): ${BODY}" >&2
      exit 1
    fi
    ;;
  network-restrictions)
    shift
    ARGS=("$@")
    HAS_PROJECT_REF=false
    HAS_EXPERIMENTAL=false
    for arg in "${ARGS[@]}"; do
      if [[ "${arg}" == "--project-ref"* ]]; then
        HAS_PROJECT_REF=true
      fi
      if [[ "${arg}" == "--experimental"* ]]; then
        HAS_EXPERIMENTAL=true
      fi
    done
    EXTRA_ARGS=()
    if [ "${HAS_PROJECT_REF}" = false ]; then
      EXTRA_ARGS+=(--project-ref "${PROJECT_REF}")
    fi
    if [ "${HAS_EXPERIMENTAL}" = false ]; then
      EXTRA_ARGS+=(--experimental)
    fi
    exec npx -y supabase@2.118.0 network-restrictions "${ARGS[@]}" "${EXTRA_ARGS[@]}"
    ;;
  *)
    exec npx -y supabase@2.118.0 "$@"
    ;;
esac
