export const setPositionByPercent = (object, GAME) => {
  const position_percent = {
    x: object.x / GAME.MAX_X,
    y: object.y / GAME.MAX_Y
  }
  object.position.set(
    GAME.screen.width * position_percent.x,
    GAME.screen.height * position_percent.y
  )
}

export const getRandomNum = (MAX, MIN) => Math.random() * (MAX - MIN) + MIN

export const genRandomHex = size => '0x' + [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

export const checkForCollision = (object1, object2, overlap = 50) => {
  const bounds1 = object1.getBounds();
  const bounds2 = object2.getBounds();

  return bounds1.x < bounds2.x + bounds2.width - overlap
      && bounds1.x + bounds1.width > bounds2.x + overlap
      && bounds1.y < bounds2.y + bounds2.height - overlap
      && bounds1.y + bounds1.height > bounds2.y + overlap
}
