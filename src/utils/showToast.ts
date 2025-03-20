import { Canvas, util } from 'fabric'
import { getObjectSize } from './getObjectSize'
import { CANVAS } from '../libs/constants'
import { TextBox } from '../components/shared/TextBox'

/**
 * 토스트 객체 fadein-fadeout 해주는 함수
 *
 * 등장 시간은 2000ms로 고정되어 있음
 *
 * @param canvas - 메시지를 표시할 Fabric Canvas 객체
 * @param object - 메시지를 표시할 TextBox 객체
 * @param text - 사용자에게 보여줄 메시지 문자열
 */
export const showToast = (canvas: Canvas, object: TextBox, text: string) => {
  /* 전달받은 텍스트로 TextBox 내용 설정 */
  object.setText({ text })

  /* 텍스트 길이에 맞춰 Rect 너비 조정 */
  const [textWidth] = getObjectSize(object.getTextObject())
  object.setRect({ width: textWidth + 24 })

  /* 화면 중앙에 위치하도록 설정 */
  object.setGroup({ left: CANVAS.WIDTH / 2 })

  object.setGroup({ opacity: 0, visible: true })
  canvas.renderAll()

  util.animate({
    startValue: 0,
    endValue: 1,
    duration: 300,
    easing: util.ease.easeInOutQuad,
    onChange: opacity => {
      object.setGroup({ opacity })
      canvas.renderAll()
    },
    onComplete: () => {
      setTimeout(() => {
        util.animate({
          startValue: 1,
          endValue: 0,
          duration: 300,
          easing: util.ease.easeInOutQuad,
          onChange: opacity => {
            object.setGroup({ opacity })
            canvas.renderAll()
          },
          onComplete: () => {
            object.setGroup({ visible: false })
            canvas.renderAll()
          }
        })
      }, 2000)
    }
  })
}
