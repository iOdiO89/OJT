import { Canvas, Group } from 'fabric'
import { CANVAS, COLOR, SIZE } from '../../libs/constants'
import { createImageElement } from '../../utils/createImageElement'
import { createDefaultButton } from '../../utils/createButton'

export async function renderImageOptions(canvas: Canvas, images: string[], startPos: number): Promise<Group[]> {
  const totalWidth = images.length * SIZE.BUTTON_WIDTH + (images.length - 1) * SIZE.GAP_SM
  const startX = (CANVAS.WIDTH - totalWidth) / 2

  const inputGroupList = []

  for (let i = 0; i < images.length; i++) {
    const imageGroup = await createImageElement(images[i], SIZE.BUTTON_WIDTH)
    const leftPos = startX + i * (SIZE.BUTTON_WIDTH + SIZE.GAP_SM)

    imageGroup.set({
      left: leftPos + SIZE.BUTTON_WIDTH / 2,
      top: startPos,
      selectable: false,
    })

    const [_, inputRect, inputGroup] = createDefaultButton('?', SIZE.BUTTON_WIDTH)
    inputRect.set({
      fill: COLOR.SUPER_LIGHT_GRAY,
    })
    inputGroup.set({
      left: leftPos + SIZE.BUTTON_WIDTH / 2,
      top: startPos + SIZE.BUTTON_WIDTH + 16,
      originY: 'top',
    })

    canvas.add(imageGroup)
    canvas.add(inputGroup)
    inputGroupList.push(inputGroup)
  }
  canvas.renderAll()

  return inputGroupList
}
