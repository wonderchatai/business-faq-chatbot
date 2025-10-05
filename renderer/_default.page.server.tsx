import { renderToStream } from 'react-dom/server'
import { escapeInject } from 'vite-plugin-ssr'

export { render }

async function render(pageContext) {
  const { Page } = pageContext
  const stream = await renderToStream(<Page />)
  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="root">${stream}</div>
      </body>
    </html>`
}
