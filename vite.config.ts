import { defineConfig } from 'vite'
import hono from '@hono/vite-dev-server'
import vike from 'vike/plugin'

export default defineConfig({
  plugins: [
    hono({
      entry: 'src/index.tsx'
    }),
    vike()
  ],
  ssr: {
    target: 'webworker' // This tells Vite/Vike to build for a Cloudflare Worker environment
  }
})
