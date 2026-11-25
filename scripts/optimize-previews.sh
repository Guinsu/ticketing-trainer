#!/usr/bin/env bash
# public/drill-previews/*.jpg 원본에서 화면에 맞는 WebP를 만든다 (cwebp 필요: brew install webp)
# - countdown-320/480.webp: 카운트다운 연습 포스터(160px·240px 표시, 2배 해상도) srcset
# - seat.webp, captcha.webp: 원본이 이미 표시 크기에 가까워 크기는 그대로 두고 WebP로만 변환
set -euo pipefail
cd "$(dirname "$0")/../public/drill-previews"
cwebp -quiet -q 78 -resize 320 0 countdown.jpg -o countdown-320.webp
cwebp -quiet -q 78 -resize 480 0 countdown.jpg -o countdown-480.webp
cwebp -quiet -q 78 seat.jpg -o seat.webp
cwebp -quiet -q 78 captcha.jpg -o captcha.webp
