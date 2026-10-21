import { useId } from 'react'

interface CaptchaBoxProps {
  value: string
}

// 보안문자에 배경 노이즈와 글자 변형을 더해 SVG로 표시한다.
export default function CaptchaBox({ value }: CaptchaBoxProps) {
  // 여러 컴포넌트를 렌더링해도 SVG 필터와 그라데이션 ID가 겹치지 않게 한다.
  const id = useId()
  const gradientId = `${id}-gradient`
  const noiseId = `${id}-noise`

  // 문자열을 시드로 변환해 같은 보안문자는 다시 렌더링되어도 모양을 유지한다.
  const seed = Array.from(value).reduce(
    (hash, character) => Math.imul(hash ^ character.charCodeAt(0), 16777619) >>> 0,
    2166136261,
  )

  // 시드와 인덱스로 0 이상 1 미만의 값을 계산해 장식의 위치와 모양을 정한다.
  const randomAt = (index: number) => {
    let hash = (seed + Math.imul(index + 1, 0x9e3779b9)) >>> 0
    hash = Math.imul(hash ^ (hash >>> 16), 0x21f0aaad)
    hash = Math.imul(hash ^ (hash >>> 15), 0x735a2d97)
    return ((hash ^ (hash >>> 15)) >>> 0) / 4294967296
  }

  const palettes = [
    ['#fca5a5', '#fff1f2', '#fdba74'],
    ['#86efac', '#f0fdf4', '#a3e635'],
    ['#93c5fd', '#eff6ff', '#67e8f9'],
    ['#c4a484', '#f5e6d3', '#d6b89c'],
    ['#fcd34d', '#fffbeb', '#fdba74'],
    ['#fdba74', '#fff7ed', '#fca5a5'],
    ['#c4b5fd', '#f5f3ff', '#f0abfc'],
    ['#f9a8d4', '#fdf2f8', '#fda4af'],
    ['#5eead4', '#f0fdfa', '#a5f3fc'],
  ]
  const palette = palettes[Math.floor(randomAt(900) * palettes.length)]

  return (
    <svg
      viewBox="0 0 360 140"
      className="h-full max-h-64 w-full"
      role="img"
      aria-label="입력할 보안문자"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette[0]} />
          <stop offset="50%" stopColor={palette[1]} />
          <stop offset="100%" stopColor={palette[2]} />
        </linearGradient>

        <filter id={noiseId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            seed={seed % 100}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      <rect width="360" height="140" rx="16" fill={`url(#${gradientId})`} />

      <rect
        x="2"
        y="2"
        width="356"
        height="136"
        rx="14"
        filter={`url(#${noiseId})`}
        opacity="0.12"
      />

      <g aria-hidden="true" pointerEvents="none">
        {Array.from({ length: 100 }, (_, index) => (
          <circle
            key={index}
            cx={8 + randomAt(index * 4) * 344}
            cy={8 + randomAt(index * 4 + 1) * 124}
            r={0.4 + randomAt(index * 4 + 2) * 1.1}
            fill="#475569"
            opacity={0.15 + randomAt(index * 4 + 3) * 0.3}
          />
        ))}
      </g>

      {/* 글자마다 높이,회전 각도, 굵기를 다르게 해서 배치한다. */}
      {value.split('').map((character, index) => {
        const x = 45 + index * 54
        const characterSeed = value.charCodeAt(index) * (index + 3) + seed
        const y = 85 + (characterSeed % 16)
        const rotation = (characterSeed % 31) - 15
        const weights = [400, 600, 700, 900]
        const fontWeight = weights[Math.floor(randomAt(1000 + index) * weights.length)]

        return (
          <text
            key={index}
            x={x}
            y={y}
            textAnchor="middle"
            fontSize="52"
            fontWeight={fontWeight}
            fill="#111827"
            transform={`rotate(${rotation} ${x} ${y})`}
          >
            {character}
          </text>
        )
      })}

      <g aria-hidden="true" pointerEvents="none">
        {/* 보안문자 위에 위치랑 굵기가 다른 곡선 4개를 그린다. */}
        {Array.from({ length: 4 }, (_, index) => {
          const offset = 500 + index * 8
          const x1 = 10 + randomAt(offset) * 80
          const y1 = 15 + randomAt(offset + 1) * 110
          const x2 = 270 + randomAt(offset + 2) * 80
          const y2 = 15 + randomAt(offset + 3) * 110

          return (
            <path
              key={index}
              d={`M${x1} ${y1} C${100 + randomAt(offset + 4) * 60} ${10 + randomAt(offset + 5) * 120}, ${200 + randomAt(offset + 6) * 60} ${10 + randomAt(offset + 7) * 120}, ${x2} ${y2}`}
              stroke="#475569"
              strokeWidth={0.8 + randomAt(offset + 4) * 0.9}
              opacity="0.6"
              strokeLinecap="round"
              fill="none"
            />
          )
        })}
      </g>
    </svg>
  )
}
