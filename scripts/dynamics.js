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
         tankBodyBox,
         tankPoly } from "./maths.js"
import { sprite_map,
         newBullet } from "./objs.js"


// handle objects and relationships
export function prestep() {
    for (const [id, sprite] of sprite_map.entries()) {
        switch (sprite.type) {
        case "tank":
            sprite.v_ang = (sprite.leftspin ^ sprite.rightspin) ?
                Constants.TANK_SPIN_VELOCITY_ANG * (sprite.leftspin ? 1 : -1) : 0
            sprite.v = sprite.forward * Constants.TANK_VELOCITY_FORWARD +
                sprite.backward * Constants.TANK_VELOCITY_BACKWARD
            if (sprite.fire) {
                sprite.fire = false
                if (sprite.num_bullets) {
                    sprite.num_bullets -= 1
                    newBullet(id)
                }
            }
            break
        case "bullet":
            if (sprite.ttl <= 0) {
                sprite_map.get(sprite.source).num_bullets += 1
                sprite_map.delete(id)
            }
            break
        default:
        }
    }
}

const colli_prio = {
    NAH: -1,

    BULLET_WALL_CORNER: 0,
    BULLET_WALL_EDGE: 1,
    BULLET_TANK: 2,

    TANK_WALL: 0,
};

// handle collision & fix problems
export function collide() {
    // walls, tanks, bullets
    // ex. bullet as hitter, wall as hittee
    for (const [hitter_id, hitter] of sprite_map.entries()) {
        let new_hitter = hitter
        let hit_prio = colli_prio.NAH // colli_prio for each hitter
        let hitter_deleted = false
        for (const [hittee_id, hittee] of sprite_map.entries()) {
            if (hitter_deleted) break
            switch (hittee.type + "&" + hitter.type) {
            case "wall&tank":
                const tank_poly = tankPoly(hitter)
                for(let i = 1; i <= 8; i++) {
                    // segment ab collides with rectangle
                    const p = tank_poly[i - 1]
                    const q = tank_poly[i % 8]

                    const l_hit = add(p, scale(sub(q, p),
                                               (hittee.x - p[0]) / (q[0] - p[0])))
                    if ((l_hit[0] > p[0] ^ l_hit[0] > q[0]) &&
                        (l_hit[1] > hittee.y && l_hit[1] < hittee.y + hittee.h)) {
                        new_hitter.v_ang = -hitter.v_ang
                        new_hitter.v = -hitter.v
                        hit_prio = colli_prio.TANK_WALL
                        break
                    }

                    const t_hit = add(p, scale(sub(q, p),
                                               (hittee.y - p[1]) / (q[1] - p[1])))
                    if ((t_hit[0] > p[0] ^ t_hit[0] > q[0]) &&
                        (t_hit[0] > hittee.x && t_hit[0] < hittee.x + hittee.w)) {
                        new_hitter.v_ang = -hitter.v_ang
                        new_hitter.v = -hitter.v
                        hit_prio = colli_prio.TANK_WALL
                        break
                    }

                    const r_hit = add(p, scale(sub(q, p),
                                               (hittee.x + hittee.w - p[0]) /
                                               (q[0] - p[0])))
                    if ((r_hit[0] > p[0] ^ r_hit[0] > q[0]) &&
                        (r_hit[1] > hittee.y && r_hit[1] < hittee.y + hittee.h)) {
                        new_hitter.v_ang = -hitter.v_ang
                        new_hitter.v = -hitter.v
                        hit_prio = colli_prio.TANK_WALL
                        break
                    }

                    const b_hit = add(p, scale(sub(q, p),
                                               (hittee.y + hittee.h - p[1]) /
                                               (q[1] - p[1])))
                    if ((b_hit[0] > p[0] ^ b_hit[0] > q[0]) &&
                        (b_hit[0] > hittee.x && b_hit[0] < hittee.x + hittee.w)) {
                        new_hitter.v_ang = -hitter.v_ang
                        new_hitter.v = -hitter.v
                        hit_prio = colli_prio.TANK_WALL
                        break
                    }
                }
                break

            case "wall&bullet":
                // circle collides with rectangle
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
                          colli_prio.BULLET_WALL_EDGE :
                          colli_prio.BULLET_WALL_CORNER
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
                const body_box = tankBodyBox(hittee)
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
                            hitter.ttl = 0 // del bullet in next prestep
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

// handle movements
export function step() {
    for (const [id, sprite] of sprite_map.entries()) {
        switch (sprite.type) {
        case "tank":
            sprite.angle += sprite.v_ang
            sprite.x += sprite.v * Math.sin(sprite.angle)
            sprite.y += -sprite.v * Math.cos(sprite.angle)
            break
        case "bullet":
            sprite.x += sprite.vx
            sprite.y += sprite.vy
            sprite.ttl -= 1
            break
        default:
        }
    }
}

