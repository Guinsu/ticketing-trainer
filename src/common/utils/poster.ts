// '/posters/1.jpg' → scripts/optimize-posters.sh가 만든 WebP 경로
const base = (poster: string) => poster.replace(/\.jpg$/, '')

export const posterThumb = (poster: string) => `${base(poster)}-thumb.webp`

export const posterSrcSet = (poster: string) =>
  `${base(poster)}-480.webp 480w, ${base(poster)}-750.webp 750w`

export const posterLarge = (poster: string) => `${base(poster)}-750.webp`
