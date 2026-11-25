import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// 경로별로 첫 화면에 필요한 화면 코드와 LCP 이미지
// 화면 코드는 router.tsx에서 lazy로 나뉘어 있어서, 원래는 index.js를 받고 실행한 뒤에야 요청된다
const ROUTE_PRELOADS: { match: string; page?: string; image?: Record<string, string> }[] = [
  {
    match: '^/$',
    image: {
      href: '/posters/1-750.webp',
      imageSrcset: '/posters/1-480.webp 480w, /posters/1-750.webp 750w',
      imageSizes: '(min-width: 640px) 224px, 100vw',
    },
  },
  { match: '^/practice$', page: 'src/pages/concertScreen.tsx' },
  { match: '^/records$', page: 'src/pages/recordsScreen.tsx' },
  { match: '^/drill(/.*)?$', page: 'src/pages/drillScreen.tsx' },
  {
    match: '^/drill/countdown$',
    image: {
      href: '/drill-previews/countdown-480.webp',
      imageSrcset:
        '/drill-previews/countdown-320.webp 320w, /drill-previews/countdown-480.webp 480w',
      imageSizes: '(min-width: 640px) 240px, 160px',
    },
  },
]

/**
 * routePreload
 * @description 빌드 시 index.html에 현재 경로의 화면 코드(modulepreload)와 LCP 이미지(preload)를
 * 바로 요청하는 스크립트를 넣는다. JS 실행을 기다리지 않고 HTML 단계에서 함께 받게 된다.
 */
const routePreload = (): Plugin => ({
  name: 'route-preload',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler(_html, ctx) {
      const bundle = ctx.bundle
      if (!bundle) return
      const chunks = Object.values(bundle).filter((output) => output.type === 'chunk')
      const entry = chunks.find((chunk) => chunk.isEntry)
      const loaded = new Set([entry?.fileName, ...(entry?.imports ?? [])])

      // 화면 청크와 그 청크가 정적으로 import하는 청크 (index.js에 이미 있는 것은 제외)
      const filesOf = (page: string) => {
        const start = chunks.find((chunk) =>
          chunk.facadeModuleId?.replaceAll('\\', '/').endsWith(page),
        )
        if (!start) throw new Error(`route-preload: ${page} 청크를 찾지 못했습니다`)
        const files = new Set<string>()
        const visit = (fileName: string) => {
          if (loaded.has(fileName) || files.has(fileName)) return
          files.add(fileName)
          const chunk = bundle[fileName]
          if (chunk?.type === 'chunk') chunk.imports.forEach(visit)
        }
        visit(start.fileName)
        return [...files].map((file) => `/${file}`)
      }

      const routes = ROUTE_PRELOADS.map(({ match, page, image }) => ({
        match,
        js: page ? filesOf(page) : [],
        image,
      }))

      const code = `(() => {
  const path = location.pathname
  for (const route of ${JSON.stringify(routes)}) {
    if (!new RegExp(route.match).test(path)) continue
    for (const href of route.js) {
      const link = document.createElement('link')
      link.rel = 'modulepreload'
      link.href = href
      document.head.appendChild(link)
    }
    if (route.image) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.fetchPriority = 'high'
      Object.assign(link, route.image)
      document.head.appendChild(link)
    }
  }
})()`
      return [{ tag: 'script', children: code, injectTo: 'head-prepend' }]
    },
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), routePreload()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
