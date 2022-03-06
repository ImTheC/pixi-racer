/***********************************************
************** HELPERS & GLOBALS ***************
************************************************/
const MAX_X = 911
const MIN_X = 88
const MAX_Y = 905
const MIN_Y = 92
const STAR_SIZE_MIN = .015
const STAR_SIZE_MAX = .03
const PLAYER_DEFAULT = {
  x: 411,
  y: 900
}
const OPPONENT_DEFAULT = {
  x: 411,
  y: -250
}
let gameInProgress = false
let speedMultiplier = 5

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

const genRandomHex = size => '0x' + [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
/************************************************/




/***********************************************
****************** INIT APP ********************
************************************************/
const app = new PIXI.Application({ width: 1000, height: 1000 })
document.body.appendChild(app.view)
/************************************************/




/***********************************************
***************** SOUND LOGIC ******************
************************************************/
const gamemusic = PIXI.sound.Sound.from('./assets/sounds/MegaHyperUltrastorm.mp3')
const wahwahwah = PIXI.sound.Sound.from('./assets/sounds/wah_wah_wah.mp3')
const player_death = PIXI.sound.Sound.from('./assets/sounds/player_death.wav')
/************************************************/




/***********************************************
*************** OPPONENTS LOGIC ****************
************************************************/
const opponent = PIXI.Sprite.from('./assets/images/ship.png')
opponent.anchor.set(0.5)
opponent.tint = 0x00C671
opponent.y = OPPONENT_DEFAULT.y
opponent.x = OPPONENT_DEFAULT.x
/************************************************/



/***********************************************
**************** PLAYERS LOGIC *****************
************************************************/
const player = PIXI.Sprite.from('./assets/images/ship.png')
setPosition(player, PLAYER_DEFAULT.x, PLAYER_DEFAULT.y)
player.anchor.set(0.5)
/************************************************/



/***********************************************
******************* DISPLAY ********************
************************************************/
let displayText = new PIXI.Text(
  0,
  {
    fontSize: 24,
    fill: 0xFFFFFF,
    wordWrap: true,
    wordWrapWidth: 180
  }
);
displayText.y = 10
displayText.x = 10
/************************************************/



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
    let elapsed = 0.0

    elapsed += delta;
    opponent.y = opponent.y + elapsed * speedMultiplier;
  
    if (opponent.y > 1010) {
      app.stage.removeChild(opponent)
      opponent.y = -250
      opponent.x = Math.random() * (MAX_X - MIN_X) + MIN_X;
      app.stage.removeChild(player)
      app.stage.addChild(opponent, player)
      speedMultiplier++
      displayText.text = speedMultiplier - 5
    }
  }
}
/************************************************/




/***********************************************
***************** STAR LOGIC *******************
************************************************/
// Get the texture for rope.
const starTexture = PIXI.Texture.from('./assets/images/star.png');

const starAmount = 100

// Create the stars
const stars = [];
for (let i = 0; i < starAmount; i++) {
  const star = {
    sprite: new PIXI.Sprite(starTexture),
    scale: getRandomNum(STAR_SIZE_MAX, STAR_SIZE_MIN),
    x: getRandomNum(1000, 0),
    y: getRandomNum(1000, 0),
    speed: getRandomNum(.3, .1),
    tint: getRandomNum(5, 0) > 3 ? '0xFFFFFF' : genRandomHex(6)
  }
  star.sprite.anchor.x = 0.5;
  star.sprite.anchor.y = 0.7;
  placeStar(star)
  app.stage.addChild(star.sprite);
  stars.push(star);
}

function placeStar(star) {
  star.sprite.tint = star.tint
  star.sprite.scale.set(star.scale, star.scale);
  star.sprite.x = star.x
  star.sprite.y = star.y
}

const starMovement = (delta) => {
  let elapsed = 0.0
  elapsed += delta;

  for (let i = 0; i < starAmount; i++) {
    stars[i].sprite.y = stars[i].sprite.y + elapsed * stars[i].speed * speedMultiplier;

    if (stars[i].sprite.y > 1010) {
      app.stage.removeChild(stars[i])
      stars[i].sprite.y = -10
      stars[i].sprite.x = getRandomNum(1000, 0)
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
  gamemusic.stop()
  player_death.play()
  app.stage.removeChild(player, opponent)
  app.stage.addChild(gameOverText)
  speedMultiplier = 5
  setTimeout(() => wahwahwah.play(), 1000)

  setTimeout(() => {
    app.stage.removeChild(gameOverText)
    newPosition = getRandomOpponentPosition()
    setPosition(opponent, newPosition.x, newPosition.y)
    setPosition(player, PLAYER_DEFAULT.x, PLAYER_DEFAULT.y)
    displayText.text = "0"
    app.stage.addChild(opponent, player, displayText)
    gameInProgress = true
    gamemusic.play()
  }, 5000);
}
/************************************************/



/***********************************************
***************** RENDER LOOP ******************
************************************************/
const startRender = () => {
  app.ticker.add((delta) => {
    if (gameInProgress) {
      starMovement(delta)
      playerInput()
      opponentMovement(delta)
      if (checkForCollision(player, opponent)) {
        console.log('we boomed')
        gameInProgress = false
        endGame()
      }
    }
  })
}
/************************************************/




/***********************************************
***************** START GAME *******************
************************************************/
const startGame = () => {
  app.stage.removeChild(startButton)
  app.stage.addChild(player, opponent, displayText)
  gamemusic.play()
  gameInProgress = true
  startRender()
}
/************************************************/




/***********************************************
**************** START BUTTON ******************
************************************************/
const startButton = new PIXI.Graphics()
startButton.lineStyle(2, 0xFEEB77, 1)
startButton.beginFill(0x00FF00, 1)
startButton.drawCircle(500, 500, 200)
startButton.endFill()
startButton.interactive = true
startButton.buttonMode = true
startButton.on('pointerup', startGame);

let playGameText = new PIXI.Text(
  'GO',
  {
    fontSize: 100,
    fill: 0xFFFFFF,
    strokeThickness: 10
  }
);
playGameText.x = 418
playGameText.y = 430

startButton.addChild(playGameText)
app.stage.addChild(startButton)
/************************************************/