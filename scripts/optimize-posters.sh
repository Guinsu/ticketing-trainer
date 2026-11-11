#!/usr/bin/env bash
# public/posters/*.jpg 원본에서 화면에 맞는 WebP를 만든다 (cwebp 필요: brew install webp)
# - N-thumb.webp: 홈 목록 썸네일(72×96 표시, 2배 해상도)
# - N-480.webp, N-750.webp: 상세 포스터 srcset
set -euo pipefail
cd "$(dirname "$0")/../public/posters"
for src in *.jpg; do
  name="${src%.jpg}"
  cwebp -quiet -q 75 -resize 144 192 "$src" -o "$name-thumb.webp"
  cwebp -quiet -q 78 -resize 480 640 "$src" -o "$name-480.webp"
  cwebp -quiet -q 78 -resize 750 1000 "$src" -o "$name-750.webp"
done
