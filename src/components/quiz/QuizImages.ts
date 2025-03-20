import { CANVAS, SIZE } from '../../libs/constants'
import { QuizImage } from './QuizImage'

/**
 * 이미지 리스트를 받아, 지정된 위치와 간격에 맞춰 QuizImage 객체 배열을 생성하는 함수
 *
 * @param images - 이미지 경로 배열
 * @param startPos - 이미지들이 배치될 시작 Y 위치 (top)
 * @param width - 각 이미지의 너비 (기본값: SIZE.BUTTON_WIDTH)
 * @param padding - 이미지 내부 패딩 (기본값: SIZE.GAP_XL)
 * @param gap - 이미지 간 간격 (기본값: SIZE.GAP_SM)
 * @returns QuizImage 객체 배열
 *
 * 주요 기능:
 * 1. 전체 이미지 그룹이 캔버스 중앙에 정렬되도록 좌표 계산
 * 2. 각 이미지 위치 및 크기 설정 후 QuizImage 객체 생성
 */
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

    /* 캔버스 중앙 정렬 */
    const leftPos = startX + i * (width + gap)
    quizImage.setGroup({ left: leftPos + width / 2, top: startPos, selectable: false })

    imageList.push(quizImage)
  }

  return imageList
}
