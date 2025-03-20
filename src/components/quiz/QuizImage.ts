import { Group, Rect, FabricImage, Shadow, GroupEvents } from 'fabric'
import { COLOR } from '../../libs/constants'
import { hexToRGB } from '../../utils/hexToRGB'

/**
 * QuizImage 클래스
 * - 퀴즈 화면에 표시되는 이미지를 정사각형 Rect에 담아 반환하는 클래스
 *
 * @see 객체 생성 예시: const quizImage = QuizImage.create(path, size, padding)
 */
export class QuizImage {
  private rect: Rect /* 배경 사각형 객체 */
  private group: Group /* 이미지와 배경을 묶은 그룹 객체 */

  private constructor(rect: Rect, group: Group) {
    this.rect = rect
    this.group = group
  }

  /**
   *
   * @param path - 이미지 파일 경로
   * @param size - 그룹 전체 크기 (기본값: 180px)
   * @param padding - 이미지와 배경 사각형 간 여백 (기본값: 40px)
   * @returns QuizImage 객체
   *
   * 주요 기능:
   * 1. 원본 이미지 비율 유지
   * 2. 최대 크기보다 클 경우 비율에 맞게 축소
   */
  public static async create(path: string, size: number = 180, padding: number = 40): Promise<QuizImage> {
    const image = await FabricImage.fromURL(path, {}, { originX: 'center', originY: 'center' })
    const imageRatio = image.width / image.height

    const maxContentSize = size - padding * 2

    /* 이미지가 최대 크기를 초과할 경우 축소 */
    if (image.width > maxContentSize || image.height > maxContentSize) {
      let scale: number
      if (imageRatio > 1) scale = maxContentSize / image.width
      else scale = maxContentSize / image.height
      image.scale(scale)
    }

    /* 이미지가 반전되지 않도록 스케일 보정 */
    image.set({ flipX: false, flipY: false, scaleX: Math.abs(image.scaleX ?? 1), scaleY: Math.abs(image.scaleY ?? 1) })

    /* 배경 사각형 생성 */
    const rect = new Rect({
      width: size,
      height: size,
      fill: COLOR.SUPER_LIGHT_GRAY,
      rx: 16,
      ry: 16,
      originX: 'center',
      originY: 'center',
      shadow: new Shadow({
        blur: 12,
        offsetY: 6,
        color: hexToRGB(COLOR.SHADOW, 0.1)
      })
    })

    /* 배경 + 이미지 그룹화 */
    const group = new Group([rect, image], {
      originX: 'center',
      originY: 'top',
      selectable: false
    })

    return new QuizImage(rect, group)
  }

  /**
   * QuizImage의 Group 객체 반환
   */
  public getGroupObject(): Group {
    return this.group
  }

  /**
   * QuizImage의 Rect 속성 변경
   *
   * @param properties - 변경할 속성(객체 형식)
   */
  public setRect(properties: Record<string, unknown>) {
    this.rect.set(properties)
  }

  /**
   * QuizImage의 Group 속성 변경
   *
   * @param properties - 변경할 속성(객체 형식)
   */
  public setGroup(properties: Record<string, unknown>) {
    this.group.set(properties)
  }

  /**
   * 그룹에 이벤트 리스너 등록
   *
   * @param eventName - 이벤트 이름
   * @param handler - 이벤트 발생 시 실행할 핸들러 함수
   */
  public on(eventName: keyof GroupEvents, handler: (...args: unknown[]) => unknown) {
    this.group.on(eventName, handler)
  }
}
