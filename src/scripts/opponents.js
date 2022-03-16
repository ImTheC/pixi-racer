import * as PIXI from 'pixi.js'
import {
  getRandomNum,
  setPositionByPercent
} from './helpers'

const OPPONENT_COLORS = [
  '0x8389f7', // purpleish
  '0xfd82ff', // pinkish
  '0xff9e66', // orangeish
  '0xf6ff00', // yellowish
  '0x00C671', // greenish
  '0x0091ff', // blueish
]

export default function createOpponents ({ texture, GAME, amount = 2 }) {
  const wrapper = {
    colorIndex: 0,

    opponents: [],

    addToStage: () => {
      wrapper.opponents.forEach(opponent => {
        GAME.stage.addChild(opponent)
      })
    },

    removeFromStage: () => {
      wrapper.opponents.forEach(opponent => {
        GAME.stage.removeChild(opponent)
      })
    },  

    reset: () => {
      wrapper.opponents.forEach(opponent => {
        opponent.speedMultiplier = 5
        opponent.setStart()
      })
    },

    startTicker: () => {
      wrapper.opponents.forEach(opponent => {
        GAME.ticker.add(opponent.ticker)
      })
    },

    stopTicker: () => {
      wrapper.opponents.forEach(opponent => {
        GAME.ticker.remove(opponent.ticker)
      })
    },
  }
  const distanceBuffer = GAME.screen.height / 2

  for (let i = 0; i < amount; i++) {
    const opponent = new PIXI.Sprite(texture)
    opponent.anchor.set(0.5)
    opponent.number = i
    opponent.speedMultiplier = 5
  
    opponent.changeColor = () => {
      wrapper.colorIndex++
      if (wrapper.colorIndex === OPPONENT_COLORS.length ) {
        wrapper.colorIndex = 0
      }
      opponent.tint = OPPONENT_COLORS[wrapper.colorIndex]
    }
    opponent.changeColor()
  
    opponent.moveToTop = () => {
      opponent.y = 0 - opponent.height
      opponent.x = getRandomNum(GAME.MAX_X - opponent.width, opponent.width)
    }

    opponent.setStart = () => {
      opponent.y = 0 - opponent.height - (distanceBuffer + opponent.height) * opponent.number
      opponent.x = getRandomNum(GAME.MAX_X - opponent.width, opponent.width)
    }
    opponent.setStart()

    opponent.resize = () => {
      const scale = GAME.STATE.scale.size
      opponent.scale.set(scale, scale)
  
      setPositionByPercent(opponent, GAME)
    }
    opponent.resize()
  
    opponent.ticker = (delta = 1) => {
      let elapsed = 0.0
  
      elapsed += delta
      opponent.y = opponent.y + elapsed * GAME.STATE.speed * GAME.STATE.scale.speed
    
      if (opponent.y > GAME.MAX_Y + 100) {
        opponent.changeColor()
        opponent.moveToTop()
        GAME.ACTIONS.SPEED.INCREASE(1 / amount)
        GAME.ACTIONS.SCORE.INCREASE()
      }
    }
  
    wrapper.opponents.push(opponent)
  }

  return wrapper
}
