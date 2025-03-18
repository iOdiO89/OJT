import { Group, IText, Rect, Shadow } from 'fabric'
import { getObjectSize } from './getObjectSize'
import { COLOR } from '../libs/constants'
import { hexToRGB } from './hexToRGB'

export const createDefaultButton = (textValue: string, width?: number): [IText, Rect, Group] => {
  const text = new IText(textValue, {
    fontSize: 24,
    fill: 'black',
    originX: 'center',
    originY: 'center',
    selectable: false,
    fontFamily: 'NanumSquareRound'
  })
  const [textWidth, textHeight] = getObjectSize(text)
  const rect = new Rect({
    width: width ?? textWidth + 24,
    height: textHeight + 16,
    rx: 8,
    ry: 8,
    fill: 'white',
    originX: 'center',
    originY: 'center',
    shadow: new Shadow({
      blur: 12,
      offsetY: 6,
      color: hexToRGB(COLOR.SHADOW, 0.03)
    }),
    selectable: false
  })

  const group = new Group([rect, text], {
    originX: 'center',
    originY: 'center',
    selectable: false,
    hasControls: false
  })

  return [text, rect, group]
}
