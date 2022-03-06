/***********************************************
************** HELPERS & GLOBALS ***************
************************************************/
const MAX_X = 911
const MIN_X = 88
const MAX_Y = 905
const MIN_Y = 92
const PLAYER_DEFAULT = {
  x: 411,
  y: 900
}
const OPPONENT_DEFAULT = {
  x: 411,
  y: -250
}

const setPosition = (object, x, y) => {
  object.x = x
  object.y = y
}

const getRandomOpponentPosition = () => {
  return {
    y: OPPONENT_DEFAULT.y,
    x: getRandomNum(MAX_X, MIN_X)
  }
}

const getRandomNum = (MAX, MIN) => {
  return Math.random() * (MAX - MIN) + MIN;
}
/************************************************/



/***********************************************
****************** INIT APP ********************
************************************************/
const app = new PIXI.Application({ width: 1000, height: 1000 })
document.body.appendChild(app.view)
/************************************************/




/***********************************************
*************** OPPONENTS LOGIC ****************
************************************************/
const opponent = PIXI.Sprite.from('./assets/ship.png')
opponent.tint = 0x00C671
opponent.y = OPPONENT_DEFAULT.y
opponent.x = OPPONENT_DEFAULT.x
app.stage.addChild(opponent)
/************************************************/



/***********************************************
**************** PLAYERS LOGIC *****************
************************************************/
const player = PIXI.Sprite.from('./assets/ship.png')
setPosition(player, PLAYER_DEFAULT.x, PLAYER_DEFAULT.y)
player.anchor.set(0.5)
app.stage.addChild(player)
/************************************************/



// /***********************************************
// ******************** DEBUG *********************
// ************************************************/
// let text = new PIXI.Text(
//   'Alexa and Kierra',
//   {
//     fontSize: 24,
//     fill: 0xFFFFFF,
//     wordWrap: true,
//     wordWrapWidth: 180
//   }
// );
// text.x = 10
// app.stage.addChild(text)
// /************************************************/



/***********************************************
***************** playerInput ******************
************************************************/
const playerInput = () => {
  // @TODO: Don't use mouse position like this. There's a better way.
  const mouseposition = app.renderer.plugins.interaction.mouse.global;

  if (mouseposition.x > MIN_X && mouseposition.x < MAX_X) {
    player.x = mouseposition.x
  }
  if (mouseposition.y > MIN_Y && mouseposition.y < MAX_Y) {
    player.y = mouseposition.y
  }

  // text.text = `X = ${player.x}; Y = ${player.y}` // *** DEBUG ***
}
/************************************************/



/***********************************************
************** opponentMovement ****************
************************************************/
const opponentMovement = (delta) => {
  if (opponent) {
    const speedMultiplier = 5
    let elapsed = 0.0

    elapsed += delta;
    opponent.y = opponent.y + elapsed * speedMultiplier;
  
    if (opponent.y > 1010) {
      app.stage.removeChild(opponent)
      opponent.y = -250
      opponent.x = Math.random() * (MAX_X - MIN_X) + MIN_X;
      app.stage.removeChild(player)
      app.stage.addChild(opponent, player)
    }
  }
}
/************************************************/



/***********************************************
************* checkForCollision ****************
************************************************/
// @TODO: Use hitboxes

function checkForCollision(object1, object2) {
  const overlap = 50
  const bounds1 = object1.getBounds();
  const bounds2 = object2.getBounds();

  return bounds1.x < bounds2.x + bounds2.width - overlap
      && bounds1.x + bounds1.width > bounds2.x + overlap
      && bounds1.y < bounds2.y + bounds2.height - overlap
      && bounds1.y + bounds1.height > bounds2.y + overlap
}
/************************************************/



/***********************************************
****************** endGame *********************
************************************************/
function endGame() {
    let gameOverText = new PIXI.Text(
    'GAME OVER',
    {
      fontSize: 24,
      fill: 0xFFFFFF
    }
  );
  gameOverText.x = 400
  gameOverText.y = 500
  app.stage.addChild(gameOverText)
  app.stage.removeChild(player, opponent)

  setTimeout(() => {
    app.stage.removeChild(gameOverText)
    newPosition = getRandomOpponentPosition()
    setPosition(opponent, newPosition.x, newPosition.y)
    setPosition(player, PLAYER_DEFAULT.x, PLAYER_DEFAULT.y)
    app.stage.addChild(opponent, player)
  }, 500);
}
/************************************************/



/***********************************************
***************** RENDER LOOP ******************
************************************************/
app.ticker.add((delta) => {
  playerInput()
  opponentMovement(delta)
  if (checkForCollision(player, opponent)) {
    console.log('we boomed')
    endGame()
  }
})
/************************************************/
