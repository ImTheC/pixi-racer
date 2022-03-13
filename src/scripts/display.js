import * as PIXI from 'pixi.js'

export default function loadDisplay (app) {
  const display = {}

  // DEBUG TEXT
  display.debug = new PIXI.Text(
    'Work in Progress',
    {
      fontSize: 24,
      fill: 0xFFFFFF,
      wordWrap: true,
      wordWrapWidth: 180
    }
  );
  display.debug.y = 10
  display.debug.x = app.screen.width - display.debug.width - 10
  display.debug.resize = () => {
    display.debug.x = app.screen.width - display.debug.width - 10
  }

  // GAME OVER TEXT
  display.gameOver = new PIXI.Text(
    'GAME OVER',
    {
      fontSize: 50,
      fill: 0xFFFFFF
    }
  );
  display.gameOver.anchor.set(0.5)
  display.gameOver.x = app.screen.width / 2
  display.gameOver.y = app.screen.height / 2

  // SCORE TEXT
  display.score = new PIXI.Text(
    0,
    {
      fontSize: 40,
      fill: 0xFFFFFF,
      wordWrap: true,
      wordWrapWidth: 180
    }
  );
  display.score.y = 10
  display.score.x = 10
  
  return display
}
