import * as PIXI from 'pixi.js'

export default function createMenu (buttons = []) {
  const padding = 20
  const menuContainer = new PIXI.Container()
  menuContainer.pivot.set(0.5, 0.5)

  let height, width
  const currentPosition = {
    x: padding,
    y: padding
  }

  buttons.forEach(button => {
    height += button.height + padding
    width += button.width + padding * 2
  })
  menuContainer.height = height
  menuContainer.width = width

  buttons.forEach(button => {
    button.x = currentPosition.x
    button.y = currentPosition.y
    menuContainer.addChild(button)
    currentPosition.y+= button.height + padding
  })

  return menuContainer
}
