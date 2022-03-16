import { sound } from '@pixi/sound';
import GAMESTATE from './gamestate'
import { checkForCollision, debounce } from './helpers';

import shipSource from '~/assets/images/ship.png'
import starSource from '~/assets/images/star.png'

import player_death from '~/assets/sounds/player_death.mp3'
import wahwahwah from '~/assets/sounds/wah_wah_wah.mp3'
import gamemusic from '~/assets/sounds/MegaHyperUltrastorm.mp3'

import createButton from './components/button'
import loadResources from './loadResources'
import createPlayer from './player'
import createOpponents from './opponents'
import loadDisplay from './display';
import createStarfield from './starfield';

const GAME = new GAMESTATE({
  resizeTo: document.body,
  autoDensity: true,
  resolution: devicePixelRatio,
})
document.body.appendChild(GAME.view)

window.onresize = () => debounce(GAME.ACTIONS.RESIZE)
screen.orientation.onchange = () => debounce(GAME.ACTIONS.RESIZE)


/***********************************************
**************** LOAD RESOURCES ****************
************************************************/
const loader = loadResources({
  GAME,
  resources: [
    { name: 'ship', url: shipSource },
    { name: 'star', url: starSource },
    { name: 'gamemusic', url: gamemusic, volume: 0.1 },
    { name: 'wahwahwah', url: wahwahwah, volume: 0.2 },
    { name: 'player_death', url: player_death, volume: 0.2 }
  ],
  onComplete: () => {
    GAME.OBJECTS.player = createPlayer({
      texture: loader.resources.ship.texture,
      GAME
    })

    GAME.OBJECTS.opponents = createOpponents({
      texture: loader.resources.ship.texture,
      GAME
    })

    GAME.OBJECTS.starfield = createStarfield({
      texture: loader.resources.star.texture,
      GAME
    })
    loadStartButton()
  }
})

GAME.DISPLAY = loadDisplay(GAME)
GAME.stage.addChild(GAME.DISPLAY.debug)
/************************************************/


/***********************************************
**************** START BUTTON ******************
************************************************/
GAME.DISPLAY.startButton = createButton({ text: 'GO', callback: startGame, GAME })

function loadStartButton () {
  GAME.stage.addChild(GAME.DISPLAY.startButton)
}
/************************************************/


/***********************************************
***************** GAMEPLAY *******************
************************************************/
function startGame () {
  GAME.stage.removeChild(GAME.DISPLAY.startButton)

  sound.play('gamemusic')
  GAME.stage.addChild(GAME.DISPLAY.score)
  GAME.OBJECTS.opponents.addToStage()
  GAME.stage.addChild(GAME.OBJECTS.player)
  GAME.OBJECTS.opponents.startTicker()
  GAME.ticker.add(GAME.OBJECTS.starfield.ticker)
  GAME.ticker.add(gameLoop)
}

function restartGame() {
    GAME.stage.removeChild(GAME.DISPLAY.gameOver)
    GAME.ACTIONS.RESET()
    startGame()
  }

function endGame() {
  sound.play('player_death')
  sound.stop('gamemusic')
  setTimeout(() => sound.play('wahwahwah'), 1000)
  
  GAME.stage.removeChild(GAME.OBJECTS.player)
  GAME.OBJECTS.opponents.removeFromStage()
  GAME.stage.addChild(GAME.DISPLAY.gameOver)
  
  GAME.OBJECTS.player.stopMoving()
  GAME.OBJECTS.player.position.set(GAME.MAX_X / 2, GAME.MAX_Y - GAME.OBJECTS.player.height)
  
  GAME.OBJECTS.opponents.stopTicker()
  GAME.OBJECTS.opponents.reset()

  GAME.ticker.remove(GAME.OBJECTS.starfield.ticker)
  GAME.ticker.remove(gameLoop)

  setTimeout(restartGame, 5000);
}

function gameLoop () {
  GAME.OBJECTS.opponents.opponents.forEach(opponent => {
    checkForCollision(GAME.OBJECTS.player, opponent) && endGame()
  })
}
/************************************************/
