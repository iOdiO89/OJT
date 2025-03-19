import { Group } from 'fabric'
import { TextBox } from '../components/shared/TextBox'

export const getOverlappedSpace = (obj1: Group, obj2: TextBox): number => {
  const obj1Coords = obj1.getBoundingRect()
  const obj2Coords = obj2.getGroupObject().getBoundingRect()

  const x1 = Math.max(obj1Coords.left, obj2Coords.left)
  const y1 = Math.max(obj1Coords.top, obj2Coords.top)
  const x2 = Math.min(obj1Coords.left + obj1Coords.width, obj2Coords.left + obj2Coords.width)
  const y2 = Math.min(obj1Coords.top + obj1Coords.height, obj2Coords.top + obj2Coords.height)

  if (x2 > x1 && y2 > y1) return (x2 - x1) * (y2 - y1)
  else return 0
}
