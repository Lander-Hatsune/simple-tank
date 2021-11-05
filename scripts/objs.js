import { Constants,
         objHash } from "./commons.js"

export let sprite_map = new Map()
export let tank_list = []
export let bullet_list = []

export function shoot(tank_hash) {
    const tank = sprite_map.get(tank_hash)
    const bullet = {
        x: tank.x,
        y: tank.y,
        vx: Math.sin(tank.angle) * Constants.BULLET_VELOCITY,
        vy: -Math.cos(tank.angle) * Constants.BULLET_VELOCITY,
        type: "bullet",
        ttl: 1000
    }
    const hash = objHash(bullet)
    sprite_map.set(hash, bullet)
    bullet_list.push(hash)
}

export function addPlayer(src) {
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

export function step() {
    for (const entry of sprite_map) {
        const sprite = entry[1]
        sprite.x += sprite.vx
        sprite.y += sprite.vy
    }
}

