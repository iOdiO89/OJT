import { PATH } from '../libs/constants'
import changeUrl from '../utils/router'

export default function Home(): HTMLElement {
  const container = document.createElement('div')
  container.innerHTML = `
    <main>
      <h1>퀴즈</h1>
      <p>description</p>
      <button>시작하기</button>
    </main>
  `

  const startButton = container.querySelector('button')
  startButton?.addEventListener('click', () => changeUrl(`${PATH.QUIZ}?no=1`))

  return container
}
