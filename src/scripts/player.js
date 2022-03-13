import * as PIXI from 'pixi.js'
import {
  clamp,
  setPositionByPercent
} from './helpers';

export default function createPlayer ({ texture, GAME }) {
  const player = new PIXI.Sprite(texture)

  player.anchor.set(0.5)
  player.interactive = true
  player.followPointer = false
  player.position.set(GAME.MAX_X / 2, GAME.MAX_Y - player.height / 2)

  player.startMoving = () => {
    player.followPointer = true
  }

  player.stopMoving = () => {
    player.followPointer = false
  }

  player.on('pointerdown', player.startMoving)
  player.on('pointerup', player.stopMoving)
  player.on('pointermove', (event) => {
    if (player.followPointer) {
      const inputPosition = event.data.global;

      player.x = clamp(inputPosition.x, player.width / 2, GAME.MAX_X - player.width / 2)
      player.y = clamp(inputPosition.y, player.height / 2, GAME.MAX_Y - player.height  / 2)
    }
  })

  player.resize = () => {
    const scale = GAME.STATE.scale.size
    player.scale.set(scale, scale)
    setPositionByPercent(player, GAME)
  }

  player.resize()

  return player
}