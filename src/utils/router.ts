import { PATH } from '../libs/constants.ts'
import { routes } from '../libs/routes.ts'

/**
 * 현재 요청된 URL이 routes 목록에 존재하는지 확인
 *
 * @param requestedUrl - 사용자가 요청한 URL
 * @returns 매칭되는 Route 객체 / 매칭이 없을 경우 false
 */
function checkUrl(requestedUrl: string): Route | false {
  const [pathname] = requestedUrl.split('?') /* 쿼리스트링 제외한 경로만 비교 */
  return routes.find(route => route.path === pathname) ?? false /* 일치하는 라우트가 없으면 false 반환 */
}

/**
 * 라우팅 함수
 *
 * @param requestedUrl - 이동할 URL
 * @param state - (optional) 라우팅시 함께 전달할 state 객체
 */
export default function changeUrl(requestedUrl: string, state?: object) {
  const $app = document.querySelector('#app') as HTMLElement | null
  if (!$app) return

  /* 기존 페이지 내용 초기화 */
  $app.innerHTML = ''

  /* 라우트 목록에 없는 경우 Not Found 페이지로 이동 */
  const match = checkUrl(requestedUrl)
  if (!match) {
    changeUrl(PATH.NOT_FOUND)
    return
  }

  /* 브라우저 히스토리 스택에 상태값과 함께 현재 URL 추가 */
  history.pushState(state ?? null, '', requestedUrl)

  /* 매칭된 페이지 컴포넌트 렌더링 */
  const pageElement = match.page()
  if (pageElement instanceof Promise) pageElement.then(page => $app.appendChild(page))
  else $app.appendChild(pageElement)

  /* 해당 페이지에 맞는 CSS 파일 적용 */
  const cssPath = `/src/styles/${match.style}.css`
  const styleElement = document.getElementById('styles') as HTMLLinkElement | null
  if (styleElement) styleElement.setAttribute('href', cssPath)
}

/* 사용자가 브라우저 뒤로가기/앞으로가기 시 현재 URL에 맞게 페이지 재렌더링 */
window.addEventListener('popstate', () => changeUrl(window.location.pathname + window.location.search))

/* 초기 페이지 로드 시 현재 URL에 맞춰 페이지 렌더링 */
window.addEventListener('DOMContentLoaded', () => changeUrl(window.location.pathname + window.location.search))
