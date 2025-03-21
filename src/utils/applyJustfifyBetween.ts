import { FabricObject } from 'fabric'
import { CANVAS } from '../libs/constants'
import { getObjectPos, placeObject } from './handleFabricObject'

/**
 * Top/Mid/Bot 객체그룹에 Justify-Between 적용
 * @see TopObjects는 움직일 필요 없으므로 Object가 아닌 Height값을 인자로 사용!
 *
 * @param topHeight - Top 그룹 Height
 * @param midObjects - 위치 이동할 Mid 그룹 객체
 * @param bottomObjects - 위치 이동할 Bottom 그룹 객체
 */
export function applyJustifyBetween(topHeight: number, midObjects: FabricObject[], bottomObjects: FabricObject[]) {
  const [midStartY, midEndY] = getObjectPos(midObjects)
  const [bottomStartY, bottomEndY] = getObjectPos(bottomObjects)

  const totalHeight = topHeight + (midEndY - midStartY) + (bottomEndY - bottomStartY)
  const totalGap = CANVAS.HEIGHT - totalHeight
  const gap = totalGap / 2

  let currentTop = topHeight + gap
  placeObject(midObjects, midStartY, currentTop)
  currentTop += midEndY - midStartY

  currentTop += gap
  placeObject(bottomObjects, bottomStartY, currentTop)
}
