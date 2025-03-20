import { Group } from 'fabric'
import { TextBox } from '../components/shared/TextBox'

/**
 * 두 객체 간 겹치는 영역의 넓이를 계산하는 함수
 *
 * @param obj1 - 비교 대상이 되는 첫 번째 Group 객체
 * @param obj2 - 비교 대상이 되는 두 번째 TextBox 객체
 * @returns 겹치는 영역의 넓이 (겹치지 않으면 0 반환)
 */
export const getOverlappedSpace = (obj1: Group, obj2: TextBox): number => {
  const obj1Coords = obj1.getBoundingRect()
  const obj2Coords = obj2.getGroupObject().getBoundingRect()

  /* 두 객체의 겹치는 영역 좌표 계산 */
  const x1 = Math.max(obj1Coords.left, obj2Coords.left)
  const y1 = Math.max(obj1Coords.top, obj2Coords.top)
  const x2 = Math.min(obj1Coords.left + obj1Coords.width, obj2Coords.left + obj2Coords.width)
  const y2 = Math.min(obj1Coords.top + obj1Coords.height, obj2Coords.top + obj2Coords.height)

  if (x2 > x1 && y2 > y1) return (x2 - x1) * (y2 - y1)
  else return 0
}
