import { Canvas, Group, util } from 'fabric'
import { getObjectSize } from './getObjectSize'
import { CANVAS } from '../libs/constants'

export const showToast = (object: Group, canvas: Canvas, text: string) => {
  const objectText = object.item(1)
  const objectRect = object.item(0)
  objectText.set({ text })
  const [textWidth, _] = getObjectSize(objectText)
  objectRect.set({
    width: textWidth + 24,
  })
  object.set({
    left: CANVAS.WIDTH / 2,
  })

  object.set({ opacity: 0, visible: true })
  canvas.renderAll()

  util.animate({
    startValue: 0,
    endValue: 1,
    duration: 300,
    easing: util.ease.easeInOutQuad,
    onChange: (opacity) => {
      object.set({ opacity })
      canvas.renderAll()
    },
    onComplete: () => {
      setTimeout(() => {
        util.animate({
          startValue: 1,
          endValue: 0,
          duration: 300,
          easing: util.ease.easeInOutQuad,
          onChange: (opacity) => {
            object.set({ opacity })
            canvas.renderAll()
          },
          onComplete: () => {
            object.set({ visible: false })
            canvas.renderAll()
          },
        })
      }, 1000)
    },
  })
}
