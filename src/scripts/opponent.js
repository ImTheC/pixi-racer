import * as PIXI from 'pixi.js'
import {
  getRandomNum,
  setPositionByPercent
} from './helpers';

import score from './score';

const OPPONENT_COLORS = [
  '0xfd82ff', // pinkish
  '0xff9e66', // orangeish
  '0xf6ff00', // yellowish
  '0x00C671', // greenish
  '0x0091ff', // blueish
  '0x8389f7', // purpleish
]

export default function createOpponent ({ texture, GAME }) {
  const opponent = new PIXI.Sprite(texture)
  opponent.anchor.set(0.5)
  opponent.tint = OPPONENT_COLORS[0]
  opponent.y = 0 - opponent.height
  opponent.x = getRandomNum(GAME.MAX_X - opponent.width, opponent.width)
  opponent.colorIndex = 0
  opponent.speedMultiplier = 5

  opponent.changeColor = () => {
    opponent.colorIndex++
    if (opponent.colorIndex === OPPONENT_COLORS.length ) {
      opponent.colorIndex = 0
    }
    opponent.tint = OPPONENT_COLORS[opponent.colorIndex]
  }

  opponent.setRandomStart = () => {
    opponent.y = 0 - opponent.height
    opponent.x = getRandomNum(GAME.MAX_X - opponent.width, opponent.width)
  }

  opponent.ticker = (delta = 1) => {
    let elapsed = 0.0

    elapsed += delta;
    opponent.y = opponent.y + elapsed * opponent.speedMultiplier * GAME.STATE.scale.speed;
  
    if (opponent.y > GAME.MAX_Y + 100) {
      opponent.changeColor()
      opponent.setRandomStart()
      opponent.speedMultiplier++
      GAME.ACTIONS.SCORE.INCREASE()
    }
  }

  opponent.reset = () => {
    opponent.speedMultiplier = 5
    opponent.setRandomStart()
  }

  opponent.resize = () => {
    const scale = GAME.STATE.scale.size
    opponent.scale.set(scale, scale)

    setPositionByPercent(opponent, GAME)
  }

  opponent.resize()

  return opponent
}
