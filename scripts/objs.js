import { Constants,
         objHash } from "./commons.js"

export const sprite_map = new Map()
export const tank_list = []
export const bullet_list = []
export let map_size = undefined

export function genMap() {
    /*
    const map = [[[1, 1], [0, 1], [1, 1], [0, 1], [1, 1], [1, 0]],
                 [[1, 0], [0, 1], [0, 0], [0, 1], [0, 0], [1, 0]],
                 [[1, 1], [1, 0], [0, 1], [0, 1], [0, 0], [1, 0]],
                 [[1, 0], [1, 0], [1, 0], [1, 0], [1, 0], [1, 0]],
                 [[1, 0], [0, 1], [0, 0], [1, 0], [0, 0], [1, 0]],
                 [[0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 0]]]
    */
    map_size = {
        height: 10 * 5,
        width: 10 * 5,
    }
    /*
    for (const [row, row_] of Object.entries(map)) {
        for (const [col, block] of Object.entries(row_)) {
            if (block[0]) newWall(row, col, "vert")
            if (block[1]) newWall(row, col, "horiz")
        }
    }
    */
    newWall(0, 0, 5, "vert")
    newWall(0, 2, 1, "vert")
    newWall(0, 4, 1, "vert")
    newWall(0, 5, 5, "vert")
    newWall(2, 1, 2, "vert")
    newWall(3, 2, 1, "vert")
    newWall(3, 3, 2, "vert")
    newWall(3, 4, 1, "vert")

    newWall(0, 0, 5, "horiz")
    newWall(1, 1, 1, "horiz")
    newWall(1, 3, 1, "horiz")
    newWall(2, 0, 1, "horiz")
    newWall(2, 2, 2, "horiz")
    newWall(4, 1, 1, "horiz")
    newWall(5, 0, 5, "horiz")
}

export function newBullet(tank_hash) {
    const tank = sprite_map.get(tank_hash)
    const bullet = {
        x: tank.x + Math.sin(tank.angle) * Constants.TANK_BODY_BIAS[0],
        y: tank.y + -Math.cos(tank.angle) * Constants.TANK_BODY_BIAS[0],
        r: Constants.BULLET_RADIUS,
        vx: Math.sin(tank.angle) * Constants.BULLET_VELOCITY,
        vy: -Math.cos(tank.angle) * Constants.BULLET_VELOCITY,
        type: "bullet",
        source: tank_hash,
        ttl: Constants.BULLET_INIT_TTL,
    }
    const hash = objHash(bullet)
    sprite_map.set(hash, bullet)
    return hash
}

export function newTank(src) {
    const img = new Image()
    img.src = src
    const tank = {
        x: Math.floor(Math.random() * (map_size.width) / Constants.BLOCK_SIZE) * 10 + Constants.BLOCK_SIZE / 2,
        y: Math.floor(Math.random() * (map_size.height) / Constants.BLOCK_SIZE) * 10 + Constants.BLOCK_SIZE / 2,
        vx: 0,
        vy: 0,
        angle: Math.random() * 2 * Math.PI,
        type: "tank",
        img: img,
        imgsrc: src,
    }
    const hash = objHash(tank)
    sprite_map.set(hash, tank)
    return hash
}

export function newWall(row, col, span, type) {
    let w = undefined
    let h = undefined
    if (type === "vert") {
        w = Constants.WALL_WIDTH
        h = Constants.BLOCK_SIZE * span + Constants.WALL_WIDTH
    } else if (type === "horiz") {
        h = Constants.WALL_WIDTH
        w = Constants.BLOCK_SIZE * span + Constants.WALL_WIDTH
    }
    const wall = {
        x: col * Constants.BLOCK_SIZE - Constants.WALL_WIDTH / 2,
        y: row * Constants.BLOCK_SIZE - Constants.WALL_WIDTH / 2,
        w: w,
        h: h,
        type: "wall",
        wall_type: type,
    }
    const hash = objHash(wall)
    sprite_map.set(hash, wall)
    return hash
}

