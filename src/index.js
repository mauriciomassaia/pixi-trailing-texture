import { Application, RenderTexture, Sprite, Graphics, filters } from 'pixi.js'

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const COLORS = [
  0xfefefe, // white
  0x7a7a78, // grey
  0xfbcb00, // yellow
  0xFF6B6B, // red
  0xFF9999, // pink
  0xBDB4F0,
  0xC9BFBF
]

const app = new Application({
  width: WIDTH,
  height: HEIGHT,
  resolution: 1,
  antialias: true,
  backgroundColor: 0xffffff
})

const { stage } = app
const mouse = { x: 0, y: 0 }
let currentColorIndex = 1

const fadeTexture = RenderTexture.create({ width: WIDTH, height: HEIGHT })
const fadeSprite = new Sprite(fadeTexture)
fadeSprite.alpha = 0.99
stage.addChild(fadeSprite)

const bgTexture = RenderTexture.create({ width: WIDTH, height: HEIGHT })
const blurFilter = new filters.BlurFilter()
blurFilter.blurX = 20
blurFilter.blurY = 20

const bgSprite = new Sprite(bgTexture)
bgSprite.filters = [blurFilter]
stage.addChild(bgSprite)

const circle = new Graphics()
circle.filters = [blurFilter]
stage.addChild(circle)

app.ticker.add(() => {
  if (Math.abs(mouse.x - circle.x) > 2) {
    blurFilter.blur = Math.min(20, blurFilter.blur + 0.5)
  } else {
    blurFilter.blur = Math.max(2, blurFilter.blur - 1)
  }
  circle.rotation += (mouse.x - mouse.y) * 0.05
  circle.x += (mouse.x - circle.x) * 0.5
  circle.y += (mouse.y - circle.y) * 0.5

  app.renderer.render(bgSprite, fadeTexture, true)
  app.renderer.render(circle, fadeTexture, false)
  app.renderer.render(fadeSprite, bgTexture, true)
})

const changeColor = () => {
  // draw big circle with current color
  circle
    .clear()
    .beginFill(COLORS[currentColorIndex])
    .drawCircle(50, 30, 100)

  // change to next color
  currentColorIndex++
  currentColorIndex %= COLORS.length

  // draw small circle with new color
  circle
    .beginFill(COLORS[currentColorIndex])
    .drawCircle(2, 0, 50)
}

const onMouseMove = ({ clientX, clientY }) => {
  mouse.x = clientX
  mouse.y = clientY
}

window.onload = () => {
  window.addEventListener('mousemove', onMouseMove, false)
  window.addEventListener('pointerdown', changeColor)

  document.body.appendChild(app.view)
  changeColor()
  app.start()
}
