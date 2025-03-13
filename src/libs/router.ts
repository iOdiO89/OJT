import { PATH } from './constants.ts'
import { routes } from './routes.ts'

function checkUrl(requestedUrl: string): Route | undefined {
  return routes.find((route) => route.path === requestedUrl)
}

export default function changeUrl(requestedUrl: string): void {
  const $app = document.querySelector('#app') as HTMLElement | null
  if (!$app) return

  $app.innerHTML = ''

  const match = checkUrl(requestedUrl)
  if (!match) {
    changeUrl(PATH.NOT_FOUND)
    return
  }

  const pageElement = match.page()
  $app.appendChild(pageElement)

  history.pushState(null, '', match.path)

  const cssPath = `/src/styles/${match.style}.css`
  const styleElement = document.getElementById('styles') as HTMLLinkElement | null
  if (styleElement) styleElement.setAttribute('href', cssPath)
}

window.addEventListener('popstate', () => {
  changeUrl(window.location.pathname)
})

changeUrl(window.location.pathname)
