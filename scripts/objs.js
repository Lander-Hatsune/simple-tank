import { Constants,
         randHash } from "./commons.js"

export const sprite_map = new Map()
export const tank_list = []
export const bullet_list = []
export let map_size = undefined

export function genMap() {
    map_size = {
        height: 10 * 5,
        width: 10 * 5,
    }

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

export function newBullet(tank_id) {
    const tank = sprite_map.get(tank_id)
    const bullet = {
        id: randHash(),
        x: tank.x + Math.sin(tank.angle) * (Constants.TANK_BODY_HEIGHT / 2 +
                                            Constants.BULLET_RADIUS),
        y: tank.y + -Math.cos(tank.angle) * (Constants.TANK_BODY_HEIGHT / 2 +
                                            Constants.BULLET_RADIUS),
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
        x: Math.floor(Math.random() * (map_size.width) / Constants.BLOCK_SIZE) * 10 + Constants.BLOCK_SIZE / 2,
        y: Math.floor(Math.random() * (map_size.height) / Constants.BLOCK_SIZE) * 10 + Constants.BLOCK_SIZE / 2,
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

