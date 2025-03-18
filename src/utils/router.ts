import { PATH } from '../libs/constants.ts'
import { routes } from '../libs/routes.ts'

function checkUrl(requestedUrl: string): Route | false {
  const [pathname] = requestedUrl.split('?')
  return routes.find(route => route.path === pathname) ?? false
}

export default function changeUrl(requestedUrl: string, state?: object): void {
  const $app = document.querySelector('#app') as HTMLElement | null
  if (!$app) return

  $app.innerHTML = ''

  const match = checkUrl(requestedUrl)
  if (!match) {
    changeUrl(PATH.NOT_FOUND)
    return
  }

  history.pushState(state ?? null, '', requestedUrl)

  const pageElement = match.page()
  if (pageElement instanceof Promise) pageElement.then(page => $app.appendChild(page))
  else $app.appendChild(pageElement)

  const cssPath = `/src/styles/${match.style}.css`
  const styleElement = document.getElementById('styles') as HTMLLinkElement | null
  if (styleElement) styleElement.setAttribute('href', cssPath)
}

window.addEventListener('popstate', () => changeUrl(window.location.pathname + window.location.search))

window.addEventListener('DOMContentLoaded', () => changeUrl(window.location.pathname + window.location.search))
