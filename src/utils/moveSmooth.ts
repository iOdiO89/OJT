import { Canvas, util } from 'fabric'
import { TextBox } from '../components/shared/TextBox'

export const moveSmooth = (
  canvas: Canvas,
  object: TextBox,
  currentLeft: number,
  currentTop: number,
  originLeft: number,
  originTop: number
) => {
  util.animate({
    startValue: currentLeft,
    endValue: originLeft,
    duration: 300,
    easing: util.ease.easeOutQuad,
    onChange: value => {
      object.setGroup({ left: value })
      object.getGroupObject().setCoords()
      canvas.renderAll()
    }
  })

  util.animate({
    startValue: currentTop,
    endValue: originTop,
    duration: 300,
    easing: util.ease.easeOutQuad,
    onChange: value => {
      object.setGroup({ top: value })
      object.getGroupObject().setCoords()
      canvas.renderAll()
    }
  })
}
