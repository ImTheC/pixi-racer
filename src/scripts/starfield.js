import * as PIXI from 'pixi.js'
import { genRandomHex, getRandomNum } from './helpers'

export default function createStarfield ({ texture, GAME }) {
  const starAmount = 100
  const colorStarThreshold = starAmount / 8
  const STAR_SIZE_MIN = 1
  const STAR_SIZE_MAX = 3

  const starfield = {
    resize: () => {
      starfield.stars.forEach(star => {
        star.x = getRandomNum(GAME.screen.width, 0)
        star.y = getRandomNum(GAME.screen.height, 0)
        star.sprite.x = star.x
        star.sprite.y = star.y
      })
    },
    stars: [],
    ticker: (delta) => {
      let elapsed = 0.0
      elapsed += delta
  
      for (let i = 0; i < starAmount; i++) {
        starfield.stars[i].sprite.y = starfield.stars[i].sprite.y + (elapsed * (starfield.stars[i].speed / 9) * GAME.STATE.speed * GAME.STATE.scale.speed)
  
        if (starfield.stars[i].sprite.y > GAME.screen.height + 10) {
          starfield.stars[i].sprite.y = -10
          starfield.stars[i].sprite.x = getRandomNum(GAME.screen.width, 0)
        }
      }
    }
  }

  for (let i = 0; i < starAmount; i++) {
    const star = {
      sprite: new PIXI.Sprite(texture),
      scale: getRandomNum(STAR_SIZE_MAX, STAR_SIZE_MIN),
      x: getRandomNum(GAME.screen.width, 0),
      y: getRandomNum(GAME.screen.height, 0),
      speed: getRandomNum(3, 1),
      tint: i < colorStarThreshold ? genRandomHex(6) : '0xFFFFFF'
    }
    star.sprite.width = star.scale
    star.sprite.height = star.scale
    star.sprite.anchor.set(0.5, 0.5)
    star.sprite.tint = star.tint
    star.sprite.x = star.x
    star.sprite.y = star.y
    GAME.stage.addChild(star.sprite)
    starfield.stars.push(star)
  }

  return starfield
}
