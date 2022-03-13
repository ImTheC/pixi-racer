import * as PIXI from 'pixi.js'
import { setPositionByPercent } from '../helpers'

export default function createButton ({
  callback = () => {},
  color = '0x00FF00',
  text = '',
  tint = '0xDDDDDD',
  height = 200,
  width = 600,
  GAME
}) {
  const buttonContainer = new PIXI.Container()

  const button = new PIXI.Graphics()
  button.lineStyle(2, 0xFEEB77, 1)
  button.beginFill(color, 1)
  button.drawRoundedRect(0, 0, width, height, 10)
  button.endFill()
  
  let buttonText = new PIXI.Text(
    text,
    {
      fontSize: 100,
      fill: 0xFFFFFF,
      strokeThickness: 10
    }
  );
  buttonText.anchor.set(0.5)
  buttonText.x = (button.x + button.width) / 2
  buttonText.y = (button.y + button.height) / 2

  let prevTint = null
  buttonContainer.addChild(button)
  buttonContainer.addChild(buttonText)
  buttonContainer.pivot.set(0.5, 0.5)
  buttonContainer.interactive = true
  buttonContainer.buttonMode = true
  buttonContainer.on('pointerover', () => {
    prevTint = button.tint
    button.tint = tint
  })
  buttonContainer.on('pointerout', () => {
    button.tint = prevTint
  })
  buttonContainer.on('pointerup', callback)

  buttonContainer.resize = () => {
    buttonContainer.scale.set(GAME.STATE.scale.size)
    setPositionByPercent(buttonContainer, GAME)
  }

  buttonContainer.resize()

  return buttonContainer
}
