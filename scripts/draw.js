import { Display,
         Constants } from "./commons.js"
import { Colors } from "./colors.js"
import { sprite_map,
         map_size } from "./objs.js"

const score_p1 = document.getElementById("player1")
const score_p2 = document.getElementById("player2")
const cvs = document.getElementById("cvs")
const ctx = cvs.getContext("2d")

function drawRect(x_, y_, w_, h_, c) {
    ctx.fillStyle = c
    ctx.fillRect(x_, y_, w_, h_)
}

function drawCircle(x_, y_, r_, c) {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(x_, y_, r_, 0, Math.PI * 2, false)
    ctx.closePath()
    ctx.fill()
}

export function incScore(p) {
    if (p == 1) {
        score_p1.textContent = Number(score_p1.textContent) + 1
    } else {
        score_p2.textContent = Number(score_p2.textContent) + 1
    }
}

let scale

export function initCanvas() {
    cvs.width = Display.CANVAS_WIDTH
    cvs.height = Display.CANVAS_HEIGHT
    scale = Math.min((Display.CANVAS_HEIGHT -
                      Display.CANVAS_PADDING * 2) /
                     (map_size.height * Constants.BLOCK_SIZE),
                     (Display.CANVAS_WIDTH -
                      Display.CANVAS_PADDING * 2) /
                     (map_size.width * Constants.BLOCK_SIZE))
}

export function blitMap() {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, Display.CANVAS_WIDTH, Display.CANVAS_HEIGHT)
    ctx.translate(Display.CANVAS_PADDING, Display.CANVAS_PADDING)
    drawRect(0, 0,
             map_size.width * Constants.BLOCK_SIZE * scale,
             map_size.height * Constants.BLOCK_SIZE * scale,
             Colors.background)
}

function drawBullet(bullet) {
    drawCircle(bullet.x * scale,
               bullet.y * scale,
               bullet.r * scale,
               Colors.bullet)
}

function drawTank(tank) {
    ctx.save()
    ctx.translate(tank.x * scale, tank.y * scale)
    ctx.rotate(tank.angle)
    ctx.drawImage(tank.img,
                  -Constants.TANK_WIDTH / 2 * scale,
                  -Constants.TANK_HEIGHT_BIAS * scale,
                  Constants.TANK_WIDTH * scale,
                  Constants.TANK_HEIGHT * scale)
    ctx.restore()
}

function drawWall(wall) {
    drawRect(wall.x * scale,
             wall.y * scale,
             wall.w * scale,
             wall.h * scale,
             Colors.border)
}

export function drawSprites() {
    for (const [, sprite] of sprite_map.entries()) {
        switch (sprite.type) {
        case "bullet":
            drawBullet(sprite)
            break
        case "tank":
            drawTank(sprite)
            break
        case "wall":
            drawWall(sprite)
            break
        default:
            //console.log("drawSprites: " + "Unrecognized sprite")
            //console.log(sprite)
        }
    }
}



