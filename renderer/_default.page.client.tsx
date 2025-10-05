import { hydrateRoot } from 'react-dom/client'

export { render }

async function render(pageContext) {
  const { Page } = pageContext
  hydrateRoot(document.getElementById('root'), <Page />)
}
