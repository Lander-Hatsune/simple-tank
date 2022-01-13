import { Constants,
         randHash,
         MapSize } from "./commons.js"
import { randInt } from "./maths.js"

export const sprite_map = new Map()
export const tank_list = []
export const bullet_list = []
export let map_size = undefined

export function genMap() {
    map_size = {
        height: randInt(MapSize.MINL, MapSize.MAXL + 1),
        width: randInt(MapSize.MINL, MapSize.MAXL + 1)
    }

    // border
    console.log(map_size)
    newWall(0, 0, map_size.height, "vert")
    newWall(0, map_size.width, map_size.height, "vert")
    newWall(0, 0, map_size.width, "horiz")
    newWall(map_size.height, 0, map_size.width, "horiz")

    // vert walls: (height) per col, (width - 1) cols
    for (let col = 1; col < map_size.width; col++) {
        let walls_enc = randInt(2 ** (map_size.height))
        let row = 0
        let span = 0
        while (walls_enc) {
            let bit = walls_enc & 1
            if (bit) {
                span += 1
            } else {
                if (span > 0) {
                    newWall(row, col, span, "vert")
                    row += span
                } else {
                    row += 1
                }
                span = 0
            }
            walls_enc >>= 1
        }
    }

    // horiz walls: (width) per row, (height - 1) rows
    for (let row = 1; row < map_size.height; row++) {
        let walls_enc = randInt(2 ** (map_size.width))
        let col = 0
        let span = 0
        while(walls_enc) {
            let bit = walls_enc & 1
            if (bit) {
                span += 1
            } else {
                if (span > 0) {
                    newWall(row, col, span, "horiz")
                    col += span
                } else {
                    col += 1
                }
                span = 0
            }
            walls_enc >>= 1
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
    const img = new Image()
    img.src = src
    const tank = {
        id: randHash(),
        x: randInt(map_size.width) * Constants.BLOCK_SIZE +
            Constants.BLOCK_SIZE / 2,
        y: randInt(map_size.height) * Constants.BLOCK_SIZE +
            Constants.BLOCK_SIZE / 2,
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

