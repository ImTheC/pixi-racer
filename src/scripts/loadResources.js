import * as PIXI from 'pixi.js'

export default function loadResources ({ GAME, resources = [], onComplete }) {
  const loadingText = new PIXI.Text(
    'Loading!', { fontSize: 100, fill: 0xFFFFFF }
  );
  loadingText.anchor.set(0.5, 0.5)
  loadingText.scale.set(GAME.STATE.scale.size)
  loadingText.x = GAME.screen.width / 2
  loadingText.y = GAME.screen.height / 2
  GAME.stage.addChild(loadingText)

  let loadingTextFadeOut = true
  const loadingTicker = () => {
    if (loadingTextFadeOut) {
      loadingText.alpha -= .025 
      if (loadingText.alpha <= 0) { loadingTextFadeOut = false }
      return
    }

    loadingText.alpha += .025
    if (loadingText.alpha >= 1) {
      loadingTextFadeOut = true
    }
  }
  GAME.ticker.add(loadingTicker)

  const loader = new PIXI.Loader();
  loader.onComplete.add(() => { 
    loadingText.destroy()
    onComplete()
    GAME.ticker.remove(loadingTicker)
  })

  resources.forEach((options) => {
    loader.add(options)
  })
  loader.load()
  return loader
}