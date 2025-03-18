import { Canvas, FabricObject, util } from 'fabric'

export const moveSmooth = (
  canvas: Canvas,
  object: FabricObject,
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
      object.set({ left: value })
      object.setCoords()
      canvas.renderAll()
    }
  })

  util.animate({
    startValue: currentTop,
    endValue: originTop,
    duration: 300,
    easing: util.ease.easeOutQuad,
    onChange: value => {
      object.set({ top: value })
      object.setCoords()
      canvas.renderAll()
    }
  })
}
