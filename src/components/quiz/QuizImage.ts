import { Group, Rect, FabricImage, Shadow } from 'fabric'
import { COLOR } from '../../libs/constants'
import { hexToRGB } from '../../utils/hexToRGB'

export class QuizImage {
  private group: Group

  private constructor(group: Group) {
    this.group = group
  }

  public static async create(path: string, size: number = 180, padding: number = 40): Promise<QuizImage> {
    const image = await FabricImage.fromURL(path, {}, { originX: 'center', originY: 'center' })
    const imageRatio = image.width / image.height

    let scale: number
    if (imageRatio > 1) scale = (size - padding * 2) / image.width
    else scale = (size - padding * 2) / image.height
    image.scale(scale)

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

    return new QuizImage(group)
  }

  public getGroupObject(): Group {
    return this.group
  }

  public setGroup(properties: Record<string, unknown>): void {
    this.group.set(properties)
  }
}
