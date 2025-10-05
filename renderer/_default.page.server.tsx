import { renderToStream } from 'react-dom/server'
import { escapeInject } from 'vite-plugin-ssr'

export { render }

async function render(pageContext) {
  const { Page } = pageContext
  const stream = await renderToStream(<Page />)
  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
      </head>
      <body>
        <div id="root">${stream}</div>
      </body>
    </html>`
}
