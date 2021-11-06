import { Constants } from "./commons.js"
import { Colors } from "./colors.js"
import { sprite_map,
         map,
         map_size } from "./objs.js"


const cvs = document.getElementById("cvs")
const ctx = cvs.getContext("2d")

function drawRect(x, y, w, h, c) {
    ctx.fillStyle = c
    ctx.fillRect(x, y, w, h)
}

function drawCircle(x, y, r, c) {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2, false)
    ctx.closePath()
    ctx.fill()
}

export let block_size = undefined

function drawWall(row, col, type) {
    const ww = Constants.WALL_WIDTH;
    if (type === "vert") {
        const wall = {
            x: Math.min(Math.max(col * block_size - ww / 2, 0), cvs.width - ww),
            y: row * block_size - ww / 2,
            w: ww,
            h: block_size + ww,
        }
        drawRect(wall.x, wall.y, wall.w, wall.h, Colors.border, ctx)
    } else if (type === "horiz") {
        const wall = {
            x: col * block_size,
            y: Math.min(Math.max(row * block_size - ww / 2, 0), cvs.height - ww),
            w: block_size,
            h: ww,
        }
        drawRect(wall.x, wall.y, wall.w, wall.h, Colors.border, ctx)
    } else {
        console.log("drawWall: " + "Wall type error")
        console.log(type)
    }
}

export function drawMap() {
    block_size = Constants.CANVAS_HEIGHT / map_size.height
    cvs.height = Constants.CANVAS_HEIGHT
    cvs.width = block_size * map_size.width
    for (let row = 0; row < map.vert.length; row += 1) 
        for (let col = 0; col < map.vert[row].length; col += 1) 
            if (map.vert[row][col] != 0) 
                drawWall(row, col, "vert")
    for (let row = 0; row < map.horiz.length; row += 1) 
        for (let col = 0; col < map.horiz[row].length; col += 1) 
            if (map.horiz[row][col] != 0) 
                drawWall(row, col, "horiz")
}

function drawBullet(x, y) {
    drawCircle(x, y, Constants.BULLET_RADIUS)
}

function drawTank(tank) {
    ctx.save()
    ctx.translate(tank.x, tank.y)
    ctx.rotate(tank.angle)
    ctx.drawImage(tank.img, -Constants.TANK_WIDTH / 2, -Constants.TANK_HEIGHT / 2,
                  Constants.TANK_WIDTH, Constants.TANK_HEIGHT)
    ctx.restore()
}

export function drawSprites() {
    for (const entry of sprite_map) {
        const sprite = entry[1]
        switch (sprite.type) {
        case "bullet":
            drawBullet(sprite.x, sprite.y)
            break
        case "tank":
            drawTank(sprite)
            break
        default:
            console.log("drawSprites: " + "Unrecognized sprite")
            console.log(sprite)
        }
    }
}



