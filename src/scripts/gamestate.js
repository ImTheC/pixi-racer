import * as PIXI from 'pixi.js'

export default class GAMESTATE extends PIXI.Application {
  constructor(options) {
    super(options)

    this.ACTIONS.CALCULATE_SCALE()
  }

  MAX_X = this.screen.width
  MAX_Y = this.screen.height

  STATE = {
    scale: {
      size: 1,
      speed: 1
    },
    score: 0
  }
  
  ACTIONS = {
    RESET: () => {
      this.ACTIONS.SCORE.RESET()
    },
    CALCULATE_SCALE: () => {
      const default_size = 1000
      const smallestSize = Math.min(this.MAX_X, this.MAX_Y)

      this.STATE.scale.size = smallestSize < default_size
        ? smallestSize / default_size
        : 1

      this.STATE.scale.speed = this.MAX_Y / default_size - .08
    },
    RESIZE: () => {
      this.ACTIONS.CALCULATE_SCALE()

      Object.keys(this.OBJECTS).forEach(key => {
        this.OBJECTS[key].resize && this.OBJECTS[key].resize()
      })
      Object.keys(this.DISPLAY).forEach(key => {
        this.DISPLAY[key].resize && this.DISPLAY[key].resize()
      })

      this.MAX_X = this.screen.width
      this.MAX_Y = this.screen.height
    },
    SCORE: {
      INCREASE: () => {
        this.STATE.score++
        this.DISPLAY.score.text = this.STATE.score
      },
      RESET: () => {
        this.STATE.score = 0
        this.DISPLAY.score.text = '0'
      }
    }
  }

  OBJECTS = {}

}