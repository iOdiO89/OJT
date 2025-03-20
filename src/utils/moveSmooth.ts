import { util } from 'fabric'
import { TextBox } from '../components/shared/TextBox'
import { canvasAtom, store } from '../libs/atoms'

/**
 * TextBox 객체를 현재 위치 -> 원래 위치로 부드럽게 이동시키는 함수
 *
 * @param object - 이동시킬 TextBox 객체
 * @param currentLeft - 현재 left 좌표
 * @param currentTop - 현재 top 좌표
 * @param originLeft - 이동 완료 후의 left 좌표 (목표 위치)
 * @param originTop - 이동 완료 후의 top 좌표 (목표 위치)
 *
 *  */

export const moveSmooth = (
  object: TextBox,
  currentLeft: number,
  currentTop: number,
  originLeft: number,
  originTop: number
) => {
  const canvas = store.get(canvasAtom)

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
