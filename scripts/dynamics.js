import { Constants } from "./commons.js"
import { sprite_map } from "./objs.js"

const rot = (vec, angle) =>
      [vec[0] * Math.cos(angle) - vec[1] * Math.sin(angle),
       vec[0] * Math.sin(angle) + vec[1] * Math.cos(angle)]

const trans = (vec, x, y) => [vec[0] + x, vec[1] + y]

const rotateAndTranslateBox = (box, angle, x, y) => 
      [trans(rot(box[0], angle), x, y),
       trans(rot(box[1], angle), x, y),
       trans(rot(box[2], angle), x, y),
       trans(rot(box[3], angle), x, y)]

const barrelBox = (tank) => rotateAndTranslateBox(
    [[-Constants.TANK_BARREL_WIDTH / 2, -Constants.TANK_HEIGHT / 2],
     [Constants.TANK_BARREL_WIDTH / 2, -Constants.TANK_HEIGHT / 2],
     [-Constants.TANK_BARREL_WIDTH / 2, -Constants.TANK_BODY_BIAS[0]],
     [Constants.TANK_BARREL_WIDTH / 2, -Constants.TANK_BODY_BIAS[0]]],
    tank.angle, tank.x, tank.y)

const bodyBox = (tank) => rotateAndTranslateBox(
    [[-Constants.TANK_WIDTH / 2, -Constants.TANK_BODY_BIAS[0]],
     [Constants.TANK_WIDTH / 2, -Constants.TANK_BODY_BIAS[0]],
     [-Constants.TANK_WIDTH / 2, Constants.TANK_BODY_BIAS[1]],
     [Constants.TANK_WIDTH / 2, Constants.TANK_BODY_BIAS[1]]],
    tank.angle, tank.x, tank.y)

export function collide() {
    // walls, tanks, bullets
    // ex. bullet as hitter, wall as hittee
    for (const [hitterhash, hitter] of sprite_map.entries()) {
        let new_hitter = hitter
        let hit_prio = -1
        for (const [hitteehash, hittee] of sprite_map.entries()) {
            switch (hittee.type + "&" + hitter.type) {
            case "wall&tank":
                break

            case "wall&bullet":
                const test_x = (hitter.x < hittee.x) ? hittee.x :
                    (hitter.x > hittee.x + hittee.w) ? hittee.x + hittee.w :
                    hitter.x
                const test_y = (hitter.y < hittee.y) ? hittee.y :
                      (hitter.y > hittee.y + hittee.h) ? hittee.y + hittee.h :
                      hitter.y
                const bool_hit = ((test_x - hitter.x) ** 2 +
                                  (test_y - hitter.y) ** 2) < hitter.r ** 2
                if (bool_hit) {
                    const hit_prio_temp = (test_x == hitter.x ||
                                           test_y == hitter.y) ? 1 : 0;
                    if (hit_prio_temp > hit_prio) {
                        hit_prio = hit_prio_temp
                        new_hitter.vx = (test_x == hitter.x) ?
                            hitter.vx : -hitter.vx
                        new_hitter.vy = (test_y == hitter.y) ?
                            hitter.vy : -hitter.vy
                    }
                }
                break

            case "tank&bullet":
                break

            default:
                continue
            }
        }
        if (hit_prio != -1)
            sprite_map.set(hitterhash, new_hitter)
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
