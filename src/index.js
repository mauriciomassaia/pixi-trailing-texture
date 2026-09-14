import { Application, RenderTexture, Sprite, Graphics, BlurFilter } from 'pixi.js'

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

const app = new Application()
const mouse = { x: 0, y: 0 }
let currentColorIndex = 1

const fadeTexture = RenderTexture.create({ width: WIDTH, height: HEIGHT })
const fadeSprite = new Sprite(fadeTexture)
fadeSprite.alpha = 0.99

const bgTexture = RenderTexture.create({ width: WIDTH, height: HEIGHT })
const blurFilter = new BlurFilter()
blurFilter.strengthX = 20
blurFilter.strengthY = 20

const bgSprite = new Sprite(bgTexture)
bgSprite.filters = [blurFilter]

const circle = new Graphics()
circle.filters = [blurFilter]

const changeColor = () => {
  // draw big circle with current color
  circle
    .clear()
    .circle(50, 30, 100)
    .fill(COLORS[currentColorIndex])

  // change to next color
  currentColorIndex++
  currentColorIndex %= COLORS.length

  // draw small circle with new color
  circle
    .circle(2, 0, 50)
    .fill(COLORS[currentColorIndex])
}

const onMouseMove = ({ clientX, clientY }) => {
  mouse.x = clientX
  mouse.y = clientY
}

window.onload = async () => {
  await app.init({
    width: WIDTH,
    height: HEIGHT,
    resolution: 1,
    antialias: true,
    backgroundColor: 0xffffff
  })

  const { stage } = app
  stage.addChild(fadeSprite)
  stage.addChild(bgSprite)
  stage.addChild(circle)

  app.ticker.add(() => {
    if (Math.abs(mouse.x - circle.x) > 2) {
      blurFilter.strength = Math.min(20, blurFilter.strength + 0.5)
    } else {
      blurFilter.strength = Math.max(2, blurFilter.strength - 1)
    }
    circle.rotation += (mouse.x - mouse.y) * 0.05
    circle.x += (mouse.x - circle.x) * 0.5
    circle.y += (mouse.y - circle.y) * 0.5

    app.renderer.render({ container: bgSprite, target: fadeTexture, clear: true })
    app.renderer.render({ container: circle, target: fadeTexture, clear: false })
    app.renderer.render({ container: fadeSprite, target: bgTexture, clear: true })
  })

  window.addEventListener('mousemove', onMouseMove, false)
  window.addEventListener('pointerdown', changeColor)

  document.body.appendChild(app.canvas)
  changeColor()
  app.start()
}
