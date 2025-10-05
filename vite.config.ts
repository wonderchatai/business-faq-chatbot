import { defineConfig } from 'vite'
import hono from '@hono/vite-dev-server'
import vike from 'vike/plugin'

export default defineConfig({
  plugins: [
    hono({
      entry: 'src/index.tsx'
    }),
    vike()
  ]
})
