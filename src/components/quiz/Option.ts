import { Group, Circle, Path } from 'fabric'
import { COLOR } from '../../libs/constants'
import { hexToRGB } from '../../utils/hexToRGB'
import { TextBox } from '../shared/TextBox'

export class Option extends TextBox {
  private mark: Group | null = null

  public showIsCorrect() {
    this.rect.set({ fill: hexToRGB(COLOR.GREEN, 0.03), stroke: COLOR.GREEN, strokeWidth: 2 })
    this.showCorrectMark()
  }

  public showIsWrong() {
    this.rect.set({ fill: hexToRGB(COLOR.RED, 0.03), stroke: COLOR.RED, strokeWidth: 2 })
    this.showWrongMark()
  }

  public showCorrectMark() {
    if (this.mark) this.group.remove(this.mark)

    const circle = new Circle({
      radius: 14,
      stroke: hexToRGB(COLOR.GREEN, 0.5),
      strokeWidth: 7,
      fill: '',
      originX: 'center',
      originY: 'center'
    })

    const rectWidth = this.rect.width ?? 0
    const rectHeight = this.rect.height ?? 0

    this.mark = new Group([circle], {
      left: this.initLeft + rectWidth / 2,
      top: this.initTop + rectHeight / 2,
      selectable: false,
      evented: false,
      originX: 'center',
      originY: 'center'
    })

    this.group.add(this.mark)
    this.group.bringObjectToFront(this.mark)
    this.group.setCoords()
  }

  public showWrongMark() {
    if (this.mark) this.group.remove(this.mark)

    const pathData = 'M -14 -14 L 14 14 M -14 14 L 14 -14'

    const cross = new Path(pathData, {
      stroke: hexToRGB(COLOR.RED, 0.7),
      strokeWidth: 5,
      fill: '',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    })

    const rectWidth = this.rect.width ?? 0
    const rectHeight = this.rect.height ?? 0

    this.mark = new Group([cross], {
      left: this.initLeft + rectWidth / 2,
      top: this.initTop + rectHeight / 2,
      selectable: false,
      evented: false,
      originX: 'center',
      originY: 'center'
    })

    this.group.add(this.mark)
    this.group.bringObjectToFront(this.mark)
    this.group.setCoords()
  }

  public removeMark(): void {
    if (this.mark) {
      this.group.remove(this.mark)
      this.mark = null
    }
  }

  public reset() {
    this.text.set({ fill: 'black' })

    this.removeMark()
    this.rect.set({ fill: 'white', stroke: COLOR.GRAY })

    this.group.set({ evented: true })
  }
}
