import { Group, Rect, FabricImage, Shadow } from 'fabric'
import { COLOR } from '../../libs/constants'
import { hexToRGB } from '../../utils/hexToRGB'

export class QuizImage {
  private rect: Rect
  private group: Group

  private constructor(rect: Rect, group: Group) {
    this.rect = rect
    this.group = group
  }

  public static async create(path: string, size: number = 180, padding: number = 40): Promise<QuizImage> {
    const image = await FabricImage.fromURL(path, {}, { originX: 'center', originY: 'center' })
    const imageRatio = image.width / image.height

    const maxContentSize = size - padding * 2

    if (image.width > maxContentSize || image.height > maxContentSize) {
      let scale: number
      if (imageRatio > 1) scale = maxContentSize / image.width
      else scale = maxContentSize / image.height
      image.scale(scale)
    }

    image.set({ flipX: false, flipY: false, scaleX: Math.abs(image.scaleX ?? 1), scaleY: Math.abs(image.scaleY ?? 1) })

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

    const group = new Group([rect, image], {
      originX: 'center',
      originY: 'top'
    })

    return new QuizImage(rect, group)
  }

  public getGroupObject(): Group {
    return this.group
  }

  public setRect(properties: Record<string, unknown>) {
    this.rect.set(properties)
  }

  public setGroup(properties: Record<string, unknown>) {
    this.group.set(properties)
  }
}
