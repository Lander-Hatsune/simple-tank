import { Constants } from "./commons.js"
import { sprite_map } from "./objs.js"

function rotateAndTranslateBox(box, angle, x, y) {
    const rot = (vec) => [vec[0] * Math.cos(angle) - vec[1] * Math.sin(angle),
                    vec[0] * Math.sin(angle) + vec[1] * Math.cos(angle)]
    const trans = (vec) => [vec[0] + x, vec[1] + y]
    return [trans(rot(box[0])),
            trans(rot(box[1])),
            trans(rot(box[2])),
            trans(rot(box[3]))]
}

function barrelBox(tank) {
    return rotateAndTranslateBox(
        [[-Constants.TANK_BARREL_WIDTH / 2, -Constants.TANK_HEIGHT / 2],
         [Constants.TANK_BARREL_WIDTH / 2, -Constants.TANK_HEIGHT / 2],
         [-Constants.TANK_BARREL_WIDTH / 2, -Constants.TANK_BODY_BIAS[0]],
         [Constants.TANK_BARREL_WIDTH / 2, -Constants.TANK_BODY_BIAS[0]]],
         tank.angle, tank.x, tank.y)
}

function bodyBox(tank) {
    return rotateAndTranslateBox(
        [[-Constants.TANK_WIDTH / 2, -Constants.TANK_BODY_BIAS[0]],
         [Constants.TANK_WIDTH / 2, -Constants.TANK_BODY_BIAS[0]],
         [-Constants.TANK_WIDTH / 2, Constants.TANK_BODY_BIAS[1]],
         [Constants.TANK_WIDTH / 2, Constants.TANK_BODY_BIAS[1]]],
         tank.angle, tank.x, tank.y)
}

function pointHitWall(vec, wall) {
    let success = vec[0] >= wall.x && vec[0] <= wall.x + wall.w &&
        vec[1] >= wall.y && vec[1] <= wall.y + wall.h
    let type = undefined
    if (success) {
        type = [{dis: Math.abs(vec[0] - wall.x), type: "vert"},
                {dis: Math.abs(vec[0] - wall.x - wall.w), type: "vert"},
                {dis: Math.abs(vec[1] - wall.y), type: "horiz"},
                {dis: Math.abs(vec[1] - wall.y - wall.h), type: "horiz"}].sort(
                    ((a, b) => a.dis - b.dis))[0].type
        return type
    }
    return undefined
}

function boxHitWall(box, wall) {
    for (const point of box) {
        let result = pointHitWall(point, wall)
        if (result)
            return result
    }
    return undefined
}

function tankWallHit(tank, wall) {
    const barrel_hit_res = boxHitWall(barrelBox(tank), wall)
    const body_hit_res = boxHitWall(bodyBox(tank), wall)
    if (barrel_hit_res) return barrel_hit_res
    if (body_hit_res) return body_hit_res
    return undefined
}

export function collide() {
    // walls, tanks, bullets
    for (let [, hitter] of sprite_map.entries()) {
        for (let [, hittee] of sprite_map.entries()) {
            let hit_type = undefined
            switch (hitter.type + "&" + hittee.type) {
            case "wall&tank":
                hit_type = tankWallHit(hittee, hitter)
                if (hit_type === "horiz")
                    hittee.vy = 0
                else if (hit_type === "vert")
                    hittee.vx = 0
                break

            case "wall&bullet":
                hit_type = pointHitWall([hittee.x, hittee.y], hitter)
                if (hit_type === "horiz")
                    hittee.vy = -hittee.vy
                if (hit_type === "vert")
                    hittee.vx = -hittee.vx
                break

            case "tank&bullet":
            case "bullet&tank":
                break

            default:
                continue
            }
        }
    }
}

export function step() {
    for (const [hash, sprite] of sprite_map.entries()) {
        if (sprite.vx && sprite.vy) {
            sprite.x += sprite.vx
            sprite.y += sprite.vy
        }
        if (sprite.ttl) {
            sprite.ttl -= 1
            if (sprite.ttl <= 0)
                sprite_map.delete(hash)
        }
    }
}
