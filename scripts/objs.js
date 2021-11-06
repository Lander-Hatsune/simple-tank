import { Constants,
         objHash } from "./commons.js"

export const sprite_map = new Map()
export const tank_list = []
export const bullet_list = []
export let map = undefined
export let map_size = undefined

export function genMap() {
    map = {
        vert: [[1, 0, 1, 1, 0, 1],
               [1, 1, 0, 0, 1, 1],
               [1, 0, 0, 0, 0, 1],
               [1, 0, 0, 0, 1, 1],
               [1, 0, 0, 1, 0, 1]],
        horiz: [[1, 1, 1, 1, 1],
                [0, 1, 0, 1, 0],
                [1, 0, 0, 0, 1],
                [0, 0, 0, 0, 1],
                [0, 0, 0, 1, 0],
                [1, 1, 1, 1, 1]],
    }
    map_size = {
        height: 10 * 5 + 1,
        width: 10 * 5 + 1,
    }
    // add all walls to sprite_map
}

export function newBullet(tank_hash) {
    const tank = sprite_map.get(tank_hash)
    const bullet = {
        x: tank.x + Math.sin(tank.angle) * Constants.TANK_BODY_BIAS[0],
        y: tank.y + -Math.cos(tank.angle) * Constants.TANK_BODY_BIAS[0],
        vx: Math.sin(tank.angle) * Constants.BULLET_VELOCITY,
        vy: -Math.cos(tank.angle) * Constants.BULLET_VELOCITY,
        type: "bullet",
        source: tank_hash,
        ttl: 1000,
    }
    const hash = objHash(bullet)
    sprite_map.set(hash, bullet)
    bullet_list.push(hash)
}

export function newTank(src) {
    const img = new Image()
    img.src = src
    const tank = {
        x: Math.random() * 800,
        y: Math.random() * 800,
        vx: 0,
        vy: 0,
        angle: Math.random() * 2 * Math.PI,
        type: "tank",
        img: img,
        c: tank_list.length,
    }
    const hash = objHash(tank)
    sprite_map.set(hash, tank)
    tank_list.push(hash)
}

export function newWall(row, col, type) {
    
}

