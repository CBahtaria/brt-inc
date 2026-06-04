#!/usr/bin/env bash
# Usage: bash stripe-update.sh <starter_url> <professional_url> <custom_url>
# Replaces placeholder Stripe URLs in index.html with real payment links.
set -euo pipefail

if [ "$#" -ne 3 ]; then
  echo "Usage: $0 <starter_url> <professional_url> <custom_url>" >&2
  exit 1
fi

STARTER="$1"
PROFESSIONAL="$2"
CUSTOM="$3"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INDEX="$SCRIPT_DIR/../../index.html"

if [ ! -f "$INDEX" ]; then
  echo "ERROR: index.html not found at $INDEX" >&2
  exit 1
fi

# Validate URLs are Stripe payment/checkout links
for url in "$STARTER" "$PROFESSIONAL" "$CUSTOM"; do
  if [[ ! "$url" =~ ^https://(buy|checkout)\.stripe\.com/ ]]; then
    echo "ERROR: '$url' does not look like a Stripe payment link" >&2
    exit 1
  fi
done

sed -i \
  -e "s|href=\"STRIPE_STARTER_URL\"|href=\"${STARTER}\"|g" \
  -e "s|href=\"STRIPE_PROFESSIONAL_URL\"|href=\"${PROFESSIONAL}\"|g" \
  -e "s|href=\"STRIPE_CUSTOM_URL\"|href=\"${CUSTOM}\"|g" \
  "$INDEX"

echo "Stripe links updated in index.html."
echo "  Starter:      $STARTER"
echo "  Professional: $PROFESSIONAL"
echo "  Custom:       $CUSTOM"
echo ""
echo "Next: vercel --prod"
