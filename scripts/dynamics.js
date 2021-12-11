import { Constants } from "./commons.js"
import { add,
         sub,
         dot,
         squaredLen,
         len,
         squaredDis,
         dis,
         scale,
         rot,
         trans,
         rotateAndTranslateBox,
         barrelBox,
         bodyBox } from "./maths.js"
import { sprite_map } from "./objs.js"

const colli_prio = {
    NAH: -1,
    WALL_CORNER: 0,
    WALL_EDGE: 1,
    TANK: 2
};

export function collide() {
    // walls, tanks, bullets
    // ex. bullet as hitter, wall as hittee
    for (const [hitter_id, hitter] of sprite_map.entries()) {
        let new_hitter = hitter
        let hit_prio = colli_prio.NAH
        let hitter_deleted = false
        for (const [hittee_id, hittee] of sprite_map.entries()) {
            if (hitter_deleted) break
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
                                           test_y == hitter.y) ?
                          colli_prio.WALL_EDGE : colli_prio.WALL_CORNER
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
                const body_box = bodyBox(hittee)
                for (let i = 1; i <= 4; i++) {
                    // segment ab collides with circle c
                    const a = body_box[i - 1]
                    const b = body_box[i % 4]
                    const c = [hitter.x, hitter.y]
                    // closest point to c on segment ab
                    const closest = add(a, scale(sub(b, a),
                                                 dot(sub(b, a), sub(c, a)) /
                                                 squaredDis(b, a)))

                    if (squaredDis(c, closest) <= Constants.BULLET_RADIUS ** 2 &&
                        closest[0] >= Math.min(a[0], b[0]) &&
                        closest[0] <= Math.max(a[0], b[0]) &&
                        closest[1] >= Math.min(a[1], b[1]) &&
                        closest[1] <= Math.max(a[1], b[1])) {
                        const hit_prio_temp = colli_prio.TANK
                        if (hit_prio_temp > hit_prio) {
                            hitter_deleted = true
                            sprite_map.delete(hitter_id)
                            sprite_map.delete(hittee_id)
                            break
                        }
                    }
                }
                break

            default:
                continue
            }
        }
        if (hit_prio != colli_prio.NAH)
            sprite_map.set(hitter_id, new_hitter)
    }
}

export function step() {
    for (const [id, sprite] of sprite_map.entries()) {
        switch (sprite.type) {
        case "tank":
            sprite.v_ang = (sprite.leftspin ^ sprite.rightspin) ?
                Constants.TANK_SPIN_VELOCITY_ANG * (sprite.leftspin ? 1 : -1) : 0
            sprite.v = sprite.forward * Constants.TANK_VELOCITY_FORWARD +
                sprite.backward * Constants.TANK_VELOCITY_BACKWARD
            sprite.angle += sprite.v_ang
            sprite.x += sprite.v * Math.sin(sprite.angle)
            sprite.y += -sprite.v * Math.cos(sprite.angle)
            break
        case "bullet":
            sprite.x += sprite.vx
            sprite.y += sprite.vy
            sprite.ttl -= 1
            if (sprite.ttl <= 0)
                sprite_map.delete(id)
            break
        default:
        }
    }
}

function tankMove(id, v) {
    let tank = sprite_map.get(id)
    tank.v = v
}

function tankSpin(id, v_ang) {
    let tank = sprite_map.get(id)
    tank.v_ang = v_ang
}

export function tankForward(id) {
    tankMove(id, Constants.TANK_VELOCITY_FORWARD)
}

export function tankBackward(id) {
    tankMove(id, Constants.TANK_VELOCITY_BACKWARD)    
}

export function tankStopMove(id) {
    tankMove(id, 0)
}

export function tankStopSpin(id) {
    tankSpin(id, 0)
}

export function tankSpinLeft(id) {
    tankSpin(id, -Constants.TANK_SPIN_VELOCITY_ANG)
}

export function tankSpinRight(id) {
    tankSpin(id, Constants.TANK_SPIN_VELOCITY_ANG)
}
