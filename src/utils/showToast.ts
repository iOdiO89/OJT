import { Canvas, util } from 'fabric'
import { getObjectSize } from './getObjectSize'
import { CANVAS } from '../libs/constants'
import { TextBox } from '../components/shared/TextBox'

export const showToast = (canvas: Canvas, object: TextBox, text: string) => {
  object.setText({ text })
  const [textWidth] = getObjectSize(object.getTextObject())
  object.setRect({ width: textWidth + 24 })
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
