#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
STAGE_DIR="$ROOT_DIR/.public-release"
ZIP_PATH="$ROOT_DIR/havenintel-public-release.zip"

rm -rf "$STAGE_DIR"
mkdir -p "$STAGE_DIR"

copy_into_stage() {
  local path="$1"
  if [ -d "$ROOT_DIR/$path" ]; then
    mkdir -p "$STAGE_DIR/$path"
    cp -R "$ROOT_DIR/$path"/. "$STAGE_DIR/$path/"
  else
    mkdir -p "$STAGE_DIR/$(dirname "$path")"
    cp "$ROOT_DIR/$path" "$STAGE_DIR/$path"
  fi
}

copy_data_file() {
  local path="$1"
  mkdir -p "$STAGE_DIR/$(dirname "$path")"
  cp "$ROOT_DIR/$path" "$STAGE_DIR/$path"
}

PUBLIC_PATHS=(
  "_headers"
  "_redirects"
  "404.html"
  "robots.txt"
  "sitemap.xml"
  "index.html"
  "past.html"
  "insights.html"
  "article.html"
  "public-view.html"
  "public-view.js"
  "shared-shell.css"
  "shared-shell.js"
  "privacy.html"
  "payment-policy.html"
  "terms.html"
  "refund-policy.html"
  "disclaimer.html"
  "responsible-use.html"
)

for path in "${PUBLIC_PATHS[@]}"; do
  copy_into_stage "$path"
done

DATA_PATHS=(
  "data/runtime-state.json"
  "data/watchlist-schedule.json"
  "data/analysis/all-analysis.slate.json"
  "data/analysis/5001993.json"
  "data/analysis/5058661.json"
  "data/analysis/5071515.json"
  "data/analysis/5071516.json"
  "data/insights/articles.json"
)

for path in "${DATA_PATHS[@]}"; do
  copy_data_file "$path"
done

rm -f "$ZIP_PATH"
(
  cd "$STAGE_DIR"
  zip -r "$ZIP_PATH" . >/dev/null
)

echo "Built public release package: $ZIP_PATH"
