import { Application, RenderTexture, Sprite, Graphics, filters } from 'pixi.js'

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

const app = new Application({
  width: WIDTH,
  height: HEIGHT,
  resolution: window.devicePixelRatio || 1,
  antialias: true,
  backgroundColor: 0xffffff
})

const { stage } = app
const mouse = { x: 0, y: 0 }

const stripes = new Graphics()

const total = 10
const w = WIDTH / total
const h = HEIGHT / total
const stripeColor1 = 0x7a7a78
const stripeColor2 = 0xfbcb00

for (var i = 0; i < total; i++) {
  stripes
    // top left half
    .beginFill(i % 2 === 0 ? stripeColor1 : stripeColor2, 1)
    .moveTo(i * w, 0)
    .lineTo((i + 1) * w, 0)
    .lineTo(0, h * (i + 1))
    .lineTo(0, h * i)

    // bottom right half
    .beginFill(i % 2 === 0 ? stripeColor1 : stripeColor2, 1)
    .moveTo(WIDTH, h * i)
    .lineTo(WIDTH, h * (i + 1))
    .lineTo(w * (i + 1), HEIGHT)
    .lineTo(w * i, HEIGHT)
    .lineTo(WIDTH, h * i)
}

stage.addChild(stripes)

const fadeTexture = RenderTexture.create(WIDTH, HEIGHT)
const fadeSprite = new Sprite(fadeTexture)
fadeSprite.alpha = 0.95
stage.addChild(fadeSprite)

const bgTexture = RenderTexture.create(WIDTH, HEIGHT)
const blurFilter = new filters.BlurFilter()
blurFilter.blurX = 20
blurFilter.blurY = 20

const bgSprite = new Sprite(bgTexture)
bgSprite.filters = [blurFilter]
stage.addChild(bgSprite)

const circle = new Graphics()
circle.beginFill(0x000000).drawCircle(0, 0, 50)
circle.filters = [blurFilter]
stage.addChild(circle)

app.ticker.add(() => {
  if (Math.abs(mouse.x - circle.x) > 2) {
    blurFilter.blur = Math.min(30, blurFilter.blur + 0.5)
  } else {
    blurFilter.blur = Math.max(2, blurFilter.blur - 1)
  }

  circle.x += (mouse.x - circle.x) * 0.25
  circle.y += (mouse.y - circle.y) * 0.25

  app.renderer.render(bgSprite, fadeTexture, true)
  app.renderer.render(circle, fadeTexture, false)

  app.renderer.render(fadeSprite, bgTexture, true)
})

function onMouseMove ({ clientX, clientY }) {
  mouse.x = clientX
  mouse.y = clientY
}

window.onload = () => {
  window.addEventListener('mousemove', onMouseMove, false)
  document.body.appendChild(app.view)
  app.start()
}
