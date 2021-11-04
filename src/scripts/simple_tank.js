import { Colors } from "./colors.js"
import { Constants } from "./cons.js"
import { drawRect,
         drawCircle } from "./basic.js"

const cvs = document.getElementById("cvs")
const ctx = cvs.getContext("2d")

let map = undefined
let map_size = undefined
let block_size = undefined
let bullets = []

function drawBorder() {
    const ww = Constants.WALL_WIDTH;
    drawRect(0, 0, cvs.width, cvs.height, Colors.border, ctx)
    drawRect(ww, ww, cvs.width - ww * 2, cvs.height - ww * 2, Colors.panel, ctx)
}

function genMap() {
    cvs.height = Constants.CANVAS_HEIGHT;
    map = {
        vert: [[0, 1, 1, 0],
                [1, 0, 0, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 1],
                [0, 0, 1, 0]],
        horiz: [[0, 1, 0, 1, 0],
                 [1, 0, 0, 0, 1],
                 [0, 0, 0, 0, 1],
                 [0, 0, 0, 1, 0]],
    }
    map_size = {
        height: 5,
        width: 5,
    }
    block_size = cvs.height / map_size.height
    cvs.width = block_size * map_size.width
}

function drawWall(row, col, type) {
    const ww = Constants.WALL_WIDTH;
    if (type === "vert") {
        drawRect((1 + col) * block_size - ww / 2, row * block_size,
                 ww, block_size, Colors.border, ctx)
    } else {
        drawRect(col * block_size, (1 + row) * block_size - ww / 2,
                 block_size, ww, Colors.border, ctx)
    }
}

function drawMap() {
    for (let row = 0; row < map.vert.length; row += 1) 
        for (let col = 0; col < map.vert[row].length; col += 1) 
            if (map.vert[row][col] != 0) 
                drawWall(row, col, "vert")
    for (let row = 0; row < map.horiz.length; row += 1) 
        for (let col = 0; col < map.horiz[row].length; col += 1) 
            if (map.horiz[row][col] != 0) 
                drawWall(row, col, "horiz")
}

function blit() {
    drawBorder()
    drawMap()
}

function refresh() {
    
}

(function() {
    genMap()
    blit()
    refresh()
    //setInterval(blit, 1000 / Constants.FPS)
    //setInterval(refresh, 1000 / Constants.REFRESH_RATE)
})()

