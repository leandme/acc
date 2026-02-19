#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT_DIR/public/models/body-visualizer/mpfb/sources"

mkdir -p "$OUT_DIR/core" "$OUT_DIR/packs" "$OUT_DIR/references"

WITH_PACKS=0
if [[ "${1:-}" == "--with-packs" ]]; then
  WITH_PACKS=1
fi

download() {
  local url="$1"
  local out="$2"
  echo "Downloading: $url"
  curl -fL "$url" -o "$out"
}

echo "== Fetching MakeHuman core proxymesh files =="
download "https://raw.githubusercontent.com/makehumancommunity/makehuman-assets/master/base/proxymeshes/male_generic/male_generic.obj" \
  "$OUT_DIR/core/male_generic.obj"
download "https://raw.githubusercontent.com/makehumancommunity/makehuman-assets/master/base/proxymeshes/female_generic/female_generic.obj" \
  "$OUT_DIR/core/female_generic.obj"
download "https://raw.githubusercontent.com/makehumancommunity/makehuman-assets/master/base/proxymeshes/male_muscle_13290/male_muscle_13290.obj" \
  "$OUT_DIR/core/male_muscle_13290.obj"
download "https://raw.githubusercontent.com/makehumancommunity/makehuman-assets/master/base/proxymeshes/female_muscle_13442/female_muscle_13442.obj" \
  "$OUT_DIR/core/female_muscle_13442.obj"

if [[ "$WITH_PACKS" -eq 1 ]]; then
  echo "== Fetching optional MakeHuman target/skin packs =="
  download "https://files.makehumancommunity.org/asset_packs/arms01/arms01_cc0.zip" \
    "$OUT_DIR/packs/arms01_cc0.zip"
  download "https://files.makehumancommunity.org/asset_packs/cheek01/cheek01_cc0.zip" \
    "$OUT_DIR/packs/cheek01_cc0.zip"
  download "https://files.makehumancommunity.org/asset_packs/ears01/ears01_cc0.zip" \
    "$OUT_DIR/packs/ears01_cc0.zip"
  download "https://files.makehumancommunity.org/asset_packs/hands01/hands01_cc0.zip" \
    "$OUT_DIR/packs/hands01_cc0.zip"
  download "https://files.makehumancommunity.org/asset_packs/nose01/nose01_cc0.zip" \
    "$OUT_DIR/packs/nose01_cc0.zip"
  download "https://files.makehumancommunity.org/asset_packs/skins01/skins01_cc0.zip" \
    "$OUT_DIR/packs/skins01_cc0.zip"
  download "https://files.makehumancommunity.org/asset_packs/skins02/skins02_cc0.zip" \
    "$OUT_DIR/packs/skins02_cc0.zip"
else
  echo "Skipping optional packs (use --with-packs to download them)."
fi

echo "== Fetching MakeHuman modifier references =="
download "https://raw.githubusercontent.com/makehumancommunity/makehuman/master/makehuman/data/modifiers/modeling_modifiers.json" \
  "$OUT_DIR/references/modeling_modifiers.json"
download "https://raw.githubusercontent.com/makehumancommunity/makehuman/master/makehuman/data/modifiers/modeling_sliders.json" \
  "$OUT_DIR/references/modeling_sliders.json"
download "https://raw.githubusercontent.com/makehumancommunity/makehuman/master/makehuman/data/modifiers/bodyshapes_modifiers.json" \
  "$OUT_DIR/references/bodyshapes_modifiers.json"
download "https://raw.githubusercontent.com/makehumancommunity/makehuman/master/makehuman/data/modifiers/measurement_modifiers.json" \
  "$OUT_DIR/references/measurement_modifiers.json"

echo "Done. Assets saved under: $OUT_DIR"
