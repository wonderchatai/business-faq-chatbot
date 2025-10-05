import { Hono } from 'hono'
import { handle } from 'hono/vite'
import chat from './api/chat'

const app = new Hono()

app.route('/api/chat', chat)

app.get('*_workers.js', (c) => {
  // Forward requests for the worker script to the vite dev server.
  // This is required for the cloudflare pages integration to work.
  return handle(c)
})

app.get('/', (c) => {
  return c.html('<h1>Hello, World!</h1>')
})

export default app
