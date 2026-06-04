#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if ! command -v vercel &>/dev/null; then
  echo "ERROR: vercel CLI not found. Run: npm install -g vercel" >&2
  exit 1
fi

echo "Deploying brt-inc to Vercel..."
vercel --prod
echo "Deploy complete."
