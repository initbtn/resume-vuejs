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

if [ "${1:-}" = "gen-types" ]; then
  mkdir -p src/types
  echo "Generating TypeScript types for Supabase project ${PROJECT_REF}..."
  npx -y supabase@2.118.0 gen types typescript --project-id "${PROJECT_REF}" > src/types/database.types.ts
  echo "Successfully generated src/types/database.types.ts"
  exit 0
fi

exec npx -y supabase@2.118.0 "$@"
