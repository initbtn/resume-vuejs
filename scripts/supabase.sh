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
  *)
    exec npx -y supabase@2.118.0 "$@"
    ;;
esac
