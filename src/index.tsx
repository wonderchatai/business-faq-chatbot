import { Hono } from 'hono'
import { renderPage } from 'vike/server' // Import renderPage from Vike
import chat from './api/chat'

const app = new Hono()

app.route('/api/chat', chat)

// Use app.all to catch GET, POST, etc. for Vike rendering
app.all('*', async (c) => {
  const pageContextInit = {
    urlOriginal: c.req.url, // Pass original URL to Vike
  }
  const pageContext = await renderPage(pageContextInit) // Let Vike handle the rendering
  const { httpResponse } = pageContext

  if (!httpResponse) {
    return c.notFound() // Or handle 404 differently if needed
  }

  const { body, statusCode, headers } = httpResponse
  headers.forEach(([name, value]) => c.header(name, value))
  c.status(statusCode as any)
  return c.body(body)
})

export default app
