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
         clamp,
         tankBodyBox,
         tankPoly } from "./maths.js"
import { sprite_map,
         newBullet } from "./objs.js"

// handle objects and relationships
export function prestep() {
    for (const [id, sprite] of sprite_map.entries()) {
        switch (sprite.type) {
        case "tank":
            if (sprite.v_ang == 0) {
                sprite.v_ang = (sprite.leftspin ^ sprite.rightspin) ?
                    Constants.TANK_SPIN_V_ANG *
                    (sprite.leftspin ? 1 : -1) : 0
            }
            if (sprite.v == 0) {
                sprite.v = sprite.forward * Constants.TANK_V_FORWARD +
                    sprite.backward * Constants.TANK_V_BACKWARD
            }
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

// handle movements
export function step() {
    for (const [id, sprite] of sprite_map.entries()) {
        switch (sprite.type) {
        case "tank":
            sprite.angle += sprite.v_ang
            if (sprite.angle > 2 * Math.PI)
                sprite.angle -= 2 * Math.PI
            if (sprite.angle < 0)
                sprite.angle += 2 * Math.PI
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

// handle collision & fix problems
const colli_prio = {
    NAH: -1,

    BULLET_WALL_CORNER: 0,
    BULLET_WALL_EDGE: 1,
    BULLET_TANK: 2,

    TANK_WALL: 0,
};

const non_hitter_list = ["wall"]

export function collide() {
    // walls, tanks, bullets
    // ex. bullet as hitter, wall as hittee
    for (const [hitter_id, hitter] of sprite_map.entries()) {
        if (non_hitter_list.includes(hitter.type))
            continue

        let new_hitter = {...hitter} // deepcopy

        if (new_hitter.type === "tank") {
            new_hitter.v = 0
            new_hitter.v_ang = 0
        }

        let hit_prio = colli_prio.NAH // colli_prio for each hitter
        let hitter_deleted = false
        for (const [hittee_id, hittee] of sprite_map.entries()) {
            if (hitter_deleted) break
            switch (hittee.type + "&" + hitter.type) {
            case "wall&tank":
                let hit = false
                let v_ang_dir = 0
                let fix = [0, 0]
                const tank_poly = tankPoly(hitter)
                for(let i = 1; i <= 8; i++) {
                    // segment ab collides with rectangle
                    const p = tank_poly[i - 1]
                    const q = tank_poly[i % 8]

                    // hit left edge of wall
                    const l_hit = add(p, scale(sub(q, p),
                                               (hittee.x - p[0]) / (q[0] - p[0])))
                    if ((l_hit[0] > p[0] ^ l_hit[0] > q[0]) &&
                        (l_hit[1] > hittee.y && l_hit[1] < hittee.y + hittee.h)) {
                        hit = true
                        fix[0] = hittee.x - Math.max(p[0], q[0])
                        if (hitter.angle > 0 &&
                            hitter.angle < Math.PI) { // tank front hit wall
                            if (hitter.angle < Math.PI / 2)
                                v_ang_dir = 1
                            else v_ang_dir = -1
                        } else {
                            if (hitter.angle < 3 / 2 * Math.PI)
                                v_ang_dir = 1
                            else v_ang_dir = -1
                        }
                        break
                    }

                    // top
                    const t_hit = add(p, scale(sub(q, p),
                                               (hittee.y - p[1]) / (q[1] - p[1])))
                    if ((t_hit[0] > p[0] ^ t_hit[0] > q[0]) &&
                        (t_hit[0] > hittee.x && t_hit[0] < hittee.x + hittee.w)) {
                        hit = true
                        fix[1] = hittee.y - Math.max(p[1], q[1])
                        if (hitter.angle > Math.PI / 2 &&
                            hitter.angle < 3 / 2 * Math.PI) {
                            if (hitter.angle < Math.PI)
                                v_ang_dir = 1
                            else v_ang_dir = -1
                        } else {
                            if (hitter.angle < Math.PI / 2)
                                v_ang_dir = -1
                            else v_ang_dir = 1
                        }
                        break
                    }

                    // right
                    const r_hit = add(p, scale(sub(q, p),
                                               (hittee.x + hittee.w - p[0]) /
                                               (q[0] - p[0])))
                    if ((r_hit[0] > p[0] ^ r_hit[0] > q[0]) &&
                        (r_hit[1] > hittee.y && r_hit[1] < hittee.y + hittee.h)) {
                        hit = true
                        fix[0] = hittee.x + hittee.w - Math.min(p[0], q[0])
                        if (hitter.angle > Math.PI &&
                            hitter.angle < 2 * Math.PI) {
                            if (hitter.angle < 3 / 2 * Math.PI)
                                v_ang_dir = 1
                            else v_ang_dir = -1
                        } else {
                            if (hitter.angle < Math.PI / 2)
                                v_ang_dir = 1
                            else v_ang_dir = -1
                        }
                        break
                    }

                    // bottom
                    const b_hit = add(p, scale(sub(q, p),
                                               (hittee.y + hittee.h - p[1]) /
                                               (q[1] - p[1])))
                    if ((b_hit[0] > p[0] ^ b_hit[0] > q[0]) &&
                        (b_hit[0] > hittee.x && b_hit[0] < hittee.x + hittee.w)) {
                        hit = true
                        fix[1] = hittee.y + hittee.h - Math.min(p[1], q[1])
                        if ((hitter.angle > 0 &&
                             hitter.angle < Math.PI / 2) ||
                            (hitter.angle > 3 / 2 * Math.PI &&
                             hitter.angle < 2 * Math.PI)) {
                            if (hitter.angle < Math.PI)
                                v_ang_dir = -1
                            else v_ang_dir = 1
                        } else {
                            if (hitter.angle < Math.PI)
                                v_ang_dir = 1
                            else v_ang_dir = -1
                        }
                        break
                    }
                }
                if (hit) {
                    new_hitter.v_ang = v_ang_dir *
                        Constants.TANK_SPIN_V_ANG
                    fix = clamp(fix, -Constants.TANK_EPS, 
                                Constants.TANK_EPS)
                    if (fix[0] != 0) 
                        new_hitter.x += fix[0] +
                        ((fix[0] < 0) ? -1 : 1) * Constants.TANK_EPS
                    if (fix[1] != 0)
                        new_hitter.y += fix[1] +
                        ((fix[1] < 0) ? -1 : 1) * Constants.TANK_EPS
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
                        const hit_prio_temp = colli_prio.BULLET_TANK
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
        sprite_map.set(hitter_id, new_hitter)
    }
}


