import { Canvas } from 'fabric'
import { CANVAS } from '../libs/constants'

/**
 * 화면 크기가 캔버스 크기보다 작을 경우, 화면 키우기를 유도하는 함수
 * - 화면이 충분히 클 때는 표시되지 않음
 * - 화면이 작을 때 문구 표시
 *
 * @param canvas
 */
export function handleScreenSize(canvas: Canvas): void {
  const canvasEl = canvas.lowerCanvasEl

  let overlay = document.getElementById('overlay')
  if (!overlay) {
    overlay = document.createElement('div')
    overlay.id = 'overlay'
    overlay.innerText = '화면이 작아요.\n화면을 키워주세요!'
    document.body.appendChild(overlay)
  }

  /**
   * 현재 브라우저 창 크기를 캔버스 크기와 비교하여,
   * - 창 크기가 캔버스보다 작으면 캔버스는 숨기고 오버레이를 표시,
   * - 창 크기가 충분하면 캔버스를 표시하고 오버레이는 숨김
   */
  function updateDisplay(): void {
    if (overlay) {
      if (window.innerWidth < CANVAS.WIDTH + 20 || window.innerHeight < CANVAS.HEIGHT + 20) {
        canvasEl.style.display = 'none'
        overlay.style.display = 'flex'
      } else {
        canvasEl.style.display = 'block'
        overlay.style.display = 'none'
      }
    }
  }

  /* 창 크기가 변경될 때마다 상태 업데이트 */
  window.addEventListener('resize', updateDisplay)

  /* 초기 상태 업데이트 */
  updateDisplay()
}
