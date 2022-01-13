import { Constants,
         randHash,
         MapSize } from "./commons.js"
import { randInt } from "./maths.js"
import { genMap,
         validateMap } from "./map.js"

export const sprite_map = new Map()
export const tank_list = []
export const bullet_list = []
export let map_size = undefined
let regions, max_c

export function initMap() {
    map_size = {
        height: randInt(MapSize.MINL, MapSize.MAXL + 1),
        width: randInt(MapSize.MINL, MapSize.MAXL + 1)
    }

    let map_
    while (true) {
        map_ = genMap()
        let [valid, regions_, max_c_] = validateMap(map_)
        console.log(valid, regions_, max_c_)
        regions = regions_
        max_c = max_c_
        if (valid) break
    }

    // add walls to sprite_map
    // border
    newWall(0, 0, map_size.height, "vert")
    newWall(0, map_size.width, map_size.height, "vert")
    newWall(0, 0, map_size.width, "horiz")
    newWall(map_size.height, 0, map_size.width, "horiz")

    // vert walls: (height) per col, (width - 1) cols
    for (let col = 1; col < map_size.width; col++) {
        let row_start = 0
        let span = 0
        for (let row = 0; row <= map_size.height; row++) {
            if (map_[row][col] === "vert") {
                span += 1
            } else {
                if (span > 0) {
                    newWall(row_start, col, span, "vert")
                }
                row_start = row + 1
                span = 0
            }
        }
    }

    // horiz walls: (width) per row, (height - 1) rows
    for (let row = 1; row < map_size.height; row++) {
        let col_start = 0
        let span = 0
        for (let col = 0; col <= map_size.width; col++) {
            if (map_[row][col] === "horiz") {
                span += 1
            } else {
                if (span > 0) {
                    newWall(row, col_start, span, "horiz")
                }
                col_start = col + 1
                span = 0
            }
        }
    }
}

export function newBullet(tank_id) {
    const tank = sprite_map.get(tank_id)
    const bullet = {
        id: randHash(),
        x: tank.x + Math.sin(tank.angle) * (Constants.TANK_BODY_HEIGHT / 2 +
                                            2 * Constants.BULLET_RADIUS),
        y: tank.y + -Math.cos(tank.angle) * (Constants.TANK_BODY_HEIGHT / 2 +
                                            2 * Constants.BULLET_RADIUS),
        r: Constants.BULLET_RADIUS,
        vx: Math.sin(tank.angle) * Constants.BULLET_V,
        vy: -Math.cos(tank.angle) * Constants.BULLET_V,
        type: "bullet",
        source: tank_id,
        ttl: Constants.BULLET_INIT_TTL,
    }
    sprite_map.set(bullet.id, bullet)
    return bullet.id
}

export function newTank(src) {
    let row, col
    while (true) {
        row = randInt(map_size.height)
        col = randInt(map_size.width)
        if (regions[row][col] == max_c)
            break
    }
    regions[row][col] = "T" // avoid same pos
    const img = new Image()
    img.src = src
    const tank = {
        id: randHash(),
        x: col * Constants.BLOCK_SIZE + Constants.BLOCK_SIZE / 2,
        y: row * Constants.BLOCK_SIZE + Constants.BLOCK_SIZE / 2,
        v: 0,
        angle: Math.random() * 2 * Math.PI,
        v_ang: 0,
        type: "tank",
        img: img,
        imgsrc: src,
        forward: false,
        backward: false,
        leftspin: false,
        rightspin: false,
        fire: false,
        num_bullets: 5
    }
    sprite_map.set(tank.id, tank)
    return tank.id
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
        id: randHash(),
        x: col * Constants.BLOCK_SIZE - Constants.WALL_WIDTH / 2,
        y: row * Constants.BLOCK_SIZE - Constants.WALL_WIDTH / 2,
        w: w,
        h: h,
        type: "wall",
        wall_type: type,
    }
    sprite_map.set(wall.id, wall)
    return wall.id
}

