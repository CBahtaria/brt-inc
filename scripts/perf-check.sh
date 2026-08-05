#!/usr/bin/env bash
# brt-inc build performance check.
#
# Measures Next.js build time, output bundle sizes, and route count.
# Pattern: v8/web-tooling-benchmark — measure real toolchain performance,
# not synthetic benchmarks.
#
# Usage:
#   ./scripts/perf-check.sh             # run once
#   ./scripts/perf-check.sh --baseline  # save current results as baseline
#   ./scripts/perf-check.sh --compare   # compare against saved baseline
#   ./scripts/perf-check.sh --json FILE # write JSON report to FILE

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASELINE_FILE="$REPO_ROOT/.perf-baseline.json"
JSON_OUT=""
MODE="run"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --baseline) MODE="baseline" ; shift ;;
    --compare)  MODE="compare"  ; shift ;;
    --json)     JSON_OUT="$2"   ; shift 2 ;;
    *) echo "Unknown flag: $1" >&2; exit 1 ;;
  esac
done

cd "$REPO_ROOT"

# ── helpers ───────────────────────────────────────────────────────────────────

dir_size_kb() {
  if [[ -d "$1" ]]; then
    du -sk "$1" 2>/dev/null | awk '{print $1}'
  else
    echo 0
  fi
}

file_count() {
  find "$1" -type f 2>/dev/null | wc -l | tr -d ' '
}

ts_ms() {
  date +%s%3N
}

# ── build ─────────────────────────────────────────────────────────────────────

echo "=== brt-inc build performance check ==="
echo "Date: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
echo "Node: $(node --version)"
echo "npm:  $(npm --version)"
echo

rm -rf .next

T_START=$(ts_ms)
npm run build 2>&1 | tee /tmp/brt-build.log
T_END=$(ts_ms)
BUILD_MS=$(( T_END - T_START ))

# ── parse build output ────────────────────────────────────────────────────────

# Route count from Next.js build output (○ static, λ dynamic, ƒ function)
ROUTE_COUNT=$(grep -cE '^[○λƒ●]' /tmp/brt-build.log 2>/dev/null || echo 0)

# Static pages
STATIC_COUNT=$(grep -cE '^○' /tmp/brt-build.log 2>/dev/null || echo 0)

# Dynamic / function routes
DYNAMIC_COUNT=$(grep -cE '^[λƒ]' /tmp/brt-build.log 2>/dev/null || echo 0)

# Bundle sizes
NEXT_SIZE_KB=$(dir_size_kb ".next")
STATIC_SIZE_KB=$(dir_size_kb ".next/static")
JS_CHUNKS=$(file_count ".next/static/chunks")
CSS_FILES=$(file_count ".next/static/css")

# ── report ────────────────────────────────────────────────────────────────────

BUILD_S=$(echo "scale=2; $BUILD_MS / 1000" | bc)

echo
echo "=== Results ==="
echo "  Build time:        ${BUILD_S}s  (${BUILD_MS}ms)"
echo "  Routes total:      $ROUTE_COUNT"
echo "    static (○):      $STATIC_COUNT"
echo "    dynamic (λƒ):    $DYNAMIC_COUNT"
echo "  .next/ size:       ${NEXT_SIZE_KB} KB"
echo "  .next/static/:     ${STATIC_SIZE_KB} KB"
echo "  JS chunks:         $JS_CHUNKS"
echo "  CSS files:         $CSS_FILES"

# ── JSON payload ──────────────────────────────────────────────────────────────

JSON=$(cat <<EOF
{
  "timestamp": "$(date -u '+%Y-%m-%dT%H:%M:%SZ')",
  "node_version": "$(node --version)",
  "build_ms": $BUILD_MS,
  "routes_total": $ROUTE_COUNT,
  "routes_static": $STATIC_COUNT,
  "routes_dynamic": $DYNAMIC_COUNT,
  "next_size_kb": $NEXT_SIZE_KB,
  "static_size_kb": $STATIC_SIZE_KB,
  "js_chunks": $JS_CHUNKS,
  "css_files": $CSS_FILES
}
EOF
)

if [[ -n "$JSON_OUT" ]]; then
  echo "$JSON" > "$JSON_OUT"
  echo
  echo "Report written to $JSON_OUT"
fi

# ── baseline mode ─────────────────────────────────────────────────────────────

if [[ "$MODE" == "baseline" ]]; then
  echo "$JSON" > "$BASELINE_FILE"
  echo
  echo "Baseline saved to $BASELINE_FILE"
  exit 0
fi

# ── compare mode ──────────────────────────────────────────────────────────────

if [[ "$MODE" == "compare" ]]; then
  if [[ ! -f "$BASELINE_FILE" ]]; then
    echo "No baseline found. Run with --baseline first." >&2
    exit 1
  fi

  echo
  echo "=== Comparison vs baseline ==="

  baseline_ms=$(python3 -c "import json,sys; d=json.load(open('$BASELINE_FILE')); print(d['build_ms'])")
  delta_ms=$(( BUILD_MS - baseline_ms ))
  delta_sign=$(( delta_ms >= 0 ? 1 : -1 ))
  delta_abs=$(( delta_ms < 0 ? -delta_ms : delta_ms ))
  delta_pct=$(echo "scale=1; 100 * $delta_ms / $baseline_ms" | bc)

  if (( delta_ms > 0 )); then
    echo "  Build time: +${delta_abs}ms (+${delta_pct}%)  SLOWER"
  elif (( delta_ms < 0 )); then
    echo "  Build time: -${delta_abs}ms (${delta_pct}%)  FASTER"
  else
    echo "  Build time: unchanged"
  fi

  baseline_kb=$(python3 -c "import json,sys; d=json.load(open('$BASELINE_FILE')); print(d['next_size_kb'])")
  size_delta=$(( NEXT_SIZE_KB - baseline_kb ))
  if (( size_delta > 50 )); then
    echo "  .next/ size: +${size_delta} KB  WARNING: output grew significantly"
  elif (( size_delta < -50 )); then
    echo "  .next/ size: ${size_delta} KB  (shrunk)"
  else
    echo "  .next/ size: ${size_delta} KB  (within tolerance)"
  fi

  baseline_routes=$(python3 -c "import json,sys; d=json.load(open('$BASELINE_FILE')); print(d['routes_total'])")
  route_delta=$(( ROUTE_COUNT - baseline_routes ))
  if (( route_delta != 0 )); then
    echo "  Routes: $(( route_delta > 0 ? '+' : '' ))${route_delta} vs baseline (${baseline_routes} → ${ROUTE_COUNT})"
  else
    echo "  Routes: unchanged ($ROUTE_COUNT)"
  fi

  # Fail if build regressed more than 30% or bundle grew more than 500 KB
  FAIL=0
  if (( delta_ms > 0 )) && (( delta_ms * 100 / baseline_ms > 30 )); then
    echo
    echo "FAIL: build time regression >30% (${delta_pct}%)"
    FAIL=1
  fi
  if (( size_delta > 500 )); then
    echo "FAIL: .next/ bundle grew by more than 500 KB (+${size_delta} KB)"
    FAIL=1
  fi

  exit $FAIL
fi
