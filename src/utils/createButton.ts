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
  })
  const [textWidth, textHeight] = getObjectSize(text)
  const rect = new Rect({
    width: width ?? textWidth + 24,
    height: textHeight + 16,
    rx: 8,
    ry: 8,
    fill: 'white',
    shadow: new Shadow({
      blur: 12,
      offsetY: 6,
      color: hexToRGB(COLOR.SHADOW, 0.03),
    }),
  })
  const [_, rectHeight] = getObjectSize(rect)

  text.set({
    left: (width ?? textWidth + 24) / 2,
    top: rectHeight / 2,
  })

  const group = new Group([rect, text], {
    selectable: false,
    hasControls: false,
  })

  return [text, rect, group]
}
