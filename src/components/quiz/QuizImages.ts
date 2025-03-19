import { CANVAS, SIZE } from '../../libs/constants'
import { QuizImage } from './QuizImage'

export async function createImages(
  images: string[],
  startPos: number,
  width: number = SIZE.BUTTON_WIDTH,
  padding: number = SIZE.GAP_XL,
  gap: number = SIZE.GAP_SM
): Promise<QuizImage[]> {
  const totalWidth = images.length * width + (images.length - 1) * gap
  const startX = (CANVAS.WIDTH - totalWidth) / 2

  const imageList = []
  for (let i = 0; i < images.length; i++) {
    const quizImage = await QuizImage.create(images[i], width, padding)

    const leftPos = startX + i * (width + gap)
    quizImage.setGroup({ left: leftPos + width / 2, top: startPos, selectable: false })

    imageList.push(quizImage)
  }

  return imageList
}
