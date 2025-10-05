import { defineConfig } from 'vite'
import hono from '@hono/vite-dev-server'
import ssr from 'vite-plugin-ssr/plugin'

export default defineConfig({
  plugins: [
    hono({
      entry: 'src/index.tsx'
    }),
    ssr()
  ]
})
